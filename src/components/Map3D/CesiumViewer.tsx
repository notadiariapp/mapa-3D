import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  STRATEGIC_LOCATIONS,
  AREA_03_POLYGON,
  LOGISTIC_CORRIDORS,
  TOUR_STOPS,
  CAMERA_PRESETS,
  CATEGORY_STYLES
} from '../../data/aracruzData';
import { StrategicLocation, TourStop, CameraAction } from '../../types/map';
import { CameraControls } from './CameraControls';
import { LocationCard } from './LocationCard';
import { TourBar } from './TourBar';
import { LocationDrawer } from './LocationDrawer';
import {
  Layers,
  MapPin,
  Maximize2,
  Navigation,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  GitBranch,
  Home
} from 'lucide-react';

declare global {
  interface Window {
    Cesium: any;
  }
}

// CESIUM ION TOKEN (Configurable via Vite env or fallback)
// Cesium World Imagery can use Ion or public Esri World Imagery
const CESIUM_ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN || '';

interface CesiumViewerProps {
  className?: string;
}

export const CesiumViewer: React.FC<CesiumViewerProps> = ({ className = 'w-full h-full' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const entitiesMapRef = useRef<Map<string, any>>(new Map());
  const tourTimerRef = useRef<number | null>(null);

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Localizando empreendimento...');
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Camera orientation metrics
  const [currentHeading, setCurrentHeading] = useState(18);
  const [currentPitch, setCurrentPitch] = useState(-38);

  // Selection & Layer Visibility
  const [selectedLocation, setSelectedLocation] = useState<StrategicLocation | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [isTourPaused, setIsTourPaused] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);

  /**
   * Helper: Generate a customized, crisp SVG billboard pin data URL
   */
  const createMarkerIcon = (
    order: number,
    label: string,
    color: string,
    isMain: boolean = false
  ): string => {
    const width = isMain ? 180 : 150;
    const height = 54;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="${isMain ? 4 : 2}" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Background Pill -->
        <rect x="2" y="2" width="${width - 4}" height="36" rx="8" fill="#0E1923" fill-opacity="0.94" stroke="${color}" stroke-width="${isMain ? 2.5 : 1.5}" filter="url(#glow)"/>
        
        <!-- Order Badge -->
        <rect x="6" y="6" width="28" height="28" rx="6" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="1"/>
        <text x="20" y="24" font-family="monospace" font-size="12" font-weight="bold" fill="${color}" text-anchor="middle">${String(order).padStart(2, '0')}</text>
        
        <!-- Label Text -->
        <text x="42" y="24" font-family="sans-serif" font-size="11" font-weight="bold" fill="#F8FAFC">${label.length > 15 ? label.substring(0, 14) + '…' : label}</text>
        
        <!-- Anchor Needle / Pointer -->
        <polygon points="${width / 2 - 6},38 ${width / 2 + 6},38 ${width / 2},50" fill="${color}"/>
        <circle cx="${width / 2}" cy="50" r="3" fill="#FFFFFF"/>
      </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  /**
   * Fly camera to location with natural easing
   */
  const flyToLocation = useCallback((loc: StrategicLocation, duration: number = 2.2) => {
    if (!viewerRef.current || !window.Cesium) return;
    const Cesium = window.Cesium;

    setSelectedLocation(loc);

    viewerRef.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        loc.longitude,
        loc.latitude,
        loc.camera.range
      ),
      orientation: {
        heading: Cesium.Math.toRadians(loc.camera.heading),
        pitch: Cesium.Math.toRadians(loc.camera.pitch),
        roll: 0.0,
      },
      duration,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    });
  }, []);

  /**
   * Fly camera to preset view (Overview or Terreno)
   */
  const flyToPreset = useCallback((presetKey: 'overview' | 'terreno', duration: number = 2.4) => {
    if (!viewerRef.current || !window.Cesium) return;
    const Cesium = window.Cesium;
    const preset = CAMERA_PRESETS[presetKey];

    if (presetKey === 'terreno') {
      const terrenoLoc = STRATEGIC_LOCATIONS.find((l) => l.id === 'area-03-terreno');
      if (terrenoLoc) {
        setSelectedLocation(terrenoLoc);
      }
    } else {
      setSelectedLocation(null);
    }

    viewerRef.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        preset.longitude,
        preset.latitude,
        preset.range
      ),
      orientation: {
        heading: Cesium.Math.toRadians(preset.heading),
        pitch: Cesium.Math.toRadians(preset.pitch),
        roll: 0.0,
      },
      duration,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    });
  }, []);

  /**
   * Execute Navigation Camera Actions (pan, rotate, tilt, zoom, presets)
   */
  const handleCameraAction = useCallback((action: CameraAction) => {
    if (!viewerRef.current || !window.Cesium) return;
    const Cesium = window.Cesium;
    const camera = viewerRef.current.camera;

    // Calculate dynamic step based on camera height (smoother when close, faster when high)
    const cameraHeight = camera.positionCartographic ? camera.positionCartographic.height : 3000;
    const moveStep = Math.max(80, Math.min(cameraHeight * 0.12, 1200));
    const rotateStep = Cesium.Math.toRadians(4.5);
    const tiltStep = Cesium.Math.toRadians(4.0);

    switch (action) {
      case 'pan_forward':
        camera.moveForward(moveStep);
        break;
      case 'pan_backward':
        camera.moveBackward(moveStep);
        break;
      case 'pan_left':
        camera.moveLeft(moveStep);
        break;
      case 'pan_right':
        camera.moveRight(moveStep);
        break;
      case 'rotate_left':
        camera.rotate(Cesium.Cartesian3.UNIT_Z, rotateStep);
        break;
      case 'rotate_right':
        camera.rotate(Cesium.Cartesian3.UNIT_Z, -rotateStep);
        break;
      case 'tilt_up':
        camera.lookUp(tiltStep);
        break;
      case 'tilt_down':
        camera.lookDown(tiltStep);
        break;
      case 'zoom_in':
        camera.zoomIn(moveStep * 1.5);
        break;
      case 'zoom_out':
        camera.zoomOut(moveStep * 1.5);
        break;
      case 'reset_north': {
        const carto = camera.positionCartographic;
        camera.flyTo({
          destination: Cesium.Cartesian3.fromRadians(
            carto.longitude,
            carto.latitude,
            carto.height
          ),
          orientation: {
            heading: 0.0,
            pitch: camera.pitch,
            roll: 0.0,
          },
          duration: 1.0,
        });
        break;
      }
      case 'view_topdown': {
        const carto = camera.positionCartographic;
        camera.flyTo({
          destination: Cesium.Cartesian3.fromRadians(
            carto.longitude,
            carto.latitude,
            carto.height
          ),
          orientation: {
            heading: camera.heading,
            pitch: Cesium.Math.toRadians(-89),
            roll: 0.0,
          },
          duration: 1.2,
        });
        break;
      }
      case 'view_oblique': {
        const carto = camera.positionCartographic;
        camera.flyTo({
          destination: Cesium.Cartesian3.fromRadians(
            carto.longitude,
            carto.latitude,
            carto.height
          ),
          orientation: {
            heading: camera.heading,
            pitch: Cesium.Math.toRadians(-40),
            roll: 0.0,
          },
          duration: 1.2,
        });
        break;
      }
      default:
        break;
    }
  }, []);

  /**
   * Tour Mode: Jump to specific stop
   */
  const goToTourStop = useCallback((stopIndex: number) => {
    if (stopIndex < 0 || stopIndex >= TOUR_STOPS.length || !viewerRef.current || !window.Cesium) {
      return;
    }
    const Cesium = window.Cesium;
    const stop = TOUR_STOPS[stopIndex];
    setCurrentStopIndex(stopIndex);

    // Identify associated location to highlight
    const loc = STRATEGIC_LOCATIONS.find((l) => l.id === stop.locationId);
    if (loc) {
      setSelectedLocation(loc);
    } else {
      setSelectedLocation(null);
    }

    // Coordinates for this stop
    let destLon = -40.0948;
    let destLat = -19.8785;
    if (loc) {
      destLon = loc.longitude;
      destLat = loc.latitude;
    } else if (stop.locationId === 'overview-regional') {
      destLon = CAMERA_PRESETS.overview.longitude;
      destLat = CAMERA_PRESETS.overview.latitude;
    }

    viewerRef.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        destLon,
        destLat,
        stop.camera.range
      ),
      orientation: {
        heading: Cesium.Math.toRadians(stop.camera.heading),
        pitch: Cesium.Math.toRadians(stop.camera.pitch),
        roll: 0.0,
      },
      duration: 3.0,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    });
  }, []);

  // Tour automated timer loop
  useEffect(() => {
    if (!isTourActive || isTourPaused) {
      if (tourTimerRef.current) {
        window.clearTimeout(tourTimerRef.current);
        tourTimerRef.current = null;
      }
      return;
    }

    const currentStop = TOUR_STOPS[currentStopIndex];
    const durationMs = (currentStop?.durationSeconds || 5) * 1000 + 3000; // time + flight duration

    tourTimerRef.current = window.setTimeout(() => {
      if (currentStopIndex < TOUR_STOPS.length - 1) {
        goToTourStop(currentStopIndex + 1);
      } else {
        // End of tour -> return to free exploration
        setIsTourActive(false);
      }
    }, durationMs);

    return () => {
      if (tourTimerRef.current) {
        window.clearTimeout(tourTimerRef.current);
      }
    };
  }, [isTourActive, isTourPaused, currentStopIndex, goToTourStop]);

  // Tour Action Triggers
  const handleStartTour = () => {
    setIsTourActive(true);
    setIsTourPaused(false);
    goToTourStop(0);
  };

  const handlePauseTour = () => {
    setIsTourPaused(true);
  };

  const handleResumeTour = () => {
    setIsTourPaused(false);
  };

  const handleNextStop = () => {
    if (currentStopIndex < TOUR_STOPS.length - 1) {
      goToTourStop(currentStopIndex + 1);
    }
  };

  const handlePrevStop = () => {
    if (currentStopIndex > 0) {
      goToTourStop(currentStopIndex - 1);
    }
  };

  const handleRestartTour = () => {
    goToTourStop(0);
  };

  const handleExitTour = () => {
    setIsTourActive(false);
    setIsTourPaused(false);
  };

  /**
   * Keyboard shortcuts handler
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          handleCameraAction('pan_forward');
          break;
        case 's':
        case 'arrowdown':
          handleCameraAction('pan_backward');
          break;
        case 'a':
        case 'arrowleft':
          handleCameraAction('pan_left');
          break;
        case 'd':
        case 'arrowright':
          handleCameraAction('pan_right');
          break;
        case 'q':
          handleCameraAction('rotate_left');
          break;
        case 'e':
          handleCameraAction('rotate_right');
          break;
        case 'r':
          handleCameraAction('tilt_up');
          break;
        case 'f':
          handleCameraAction('tilt_down');
          break;
        case '+':
        case '=':
          handleCameraAction('zoom_in');
          break;
        case '-':
        case '_':
          handleCameraAction('zoom_out');
          break;
        case 'n':
          handleCameraAction('reset_north');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCameraAction]);

  /**
   * Initialize Cesium.Viewer and Load Geo Assets
   */
  useEffect(() => {
    if (!containerRef.current) return;

    // Check if Cesium loaded
    if (!window.Cesium) {
      setHasWebGLError(true);
      setErrorMessage('CesiumJS CDN não carregou no navegador.');
      setIsLoading(false);
      return;
    }

    const Cesium = window.Cesium;

    // Set Ion Token if provided
    if (CESIUM_ION_TOKEN) {
      Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;
    }

    setLoadingText('Carregando mapa 3D geoespacial...');

    let viewer: any = null;

    try {
      // Configure high-definition satellite imagery provider
      // Using Esri World Imagery which delivers beautiful real satellite imagery for Aracruz
      const imageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maximumLevel: 19,
        credit: 'Esri, Maxar, Earthstar Geographics, CNES/Airbus DS',
      });

      viewer = new Cesium.Viewer(containerRef.current, {
        baseLayer: new Cesium.ImageryLayer(imageryProvider),
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        selectionIndicator: false,
        timeline: false,
        animation: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        sceneModePicker: false,
        scene3DOnly: true,
        shouldAnimate: true,
      });

      viewerRef.current = viewer;

      // Enhance atmosphere and graphics for premium cinematic feel
      const scene = viewer.scene;
      scene.globe.enableLighting = false; // keep bright crisp visibility
      scene.globe.depthTestAgainstTerrain = false;
      if (scene.skyAtmosphere) {
        scene.skyAtmosphere.show = true;
      }

      // Add Area 03 Polygon (Real Geometry)
      setLoadingText('Renderizando polígono da Área 03...');
      const polygonPositions = AREA_03_POLYGON.map((pt) =>
        Cesium.Cartesian3.fromDegrees(pt.longitude, pt.latitude)
      );

      // Area 03 Polygon Entity
      viewer.entities.add({
        id: 'polygon-area-03',
        name: 'Área 03 – Empreendimento Principal',
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(polygonPositions),
          material: Cesium.Color.fromCssColorString('#FF6A1A').withAlpha(0.28),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#FF6A1A'),
          outlineWidth: 4,
          height: 12,
        },
      });

      // Area 03 Glowing boundary polyline
      viewer.entities.add({
        id: 'outline-area-03',
        polyline: {
          positions: polygonPositions,
          width: 3.5,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.25,
            color: Cesium.Color.fromCssColorString('#FF6A1A'),
          }),
        },
      });

      // Add All Strategic Locations (Billboards & Labels)
      setLoadingText('Plotando pontos estratégicos do KML...');
      STRATEGIC_LOCATIONS.forEach((loc) => {
        const catStyle = CATEGORY_STYLES[loc.category] || CATEGORY_STYLES.logistica;
        const iconDataUrl = createMarkerIcon(
          loc.orderNumber,
          loc.shortLabel,
          catStyle.color,
          loc.isMainAsset
        );

        const entity = viewer.entities.add({
          id: loc.id,
          name: loc.name,
          position: Cesium.Cartesian3.fromDegrees(
            loc.longitude,
            loc.latitude,
            loc.altitude || 15
          ),
          billboard: {
            image: iconDataUrl,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            scale: loc.isMainAsset ? 1.05 : 0.9,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 45000),
          },
          // Invisible point for click hit-testing
          point: {
            pixelSize: 28,
            color: Cesium.Color.TRANSPARENT,
          },
        });

        entitiesMapRef.current.set(loc.id, entity);
      });

      // Add Logistic Corridors (Polyline Connections)
      LOGISTIC_CORRIDORS.forEach((corridor) => {
        const corridorPositions = corridor.points.map((pt) =>
          Cesium.Cartesian3.fromDegrees(pt[0], pt[1], 10)
        );

        viewer.entities.add({
          id: corridor.id,
          name: corridor.name,
          polyline: {
            positions: corridorPositions,
            width: 2.5,
            material: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.fromCssColorString(corridor.color).withAlpha(0.7),
              gapColor: Cesium.Color.TRANSPARENT,
              dashLength: 18,
            }),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 50000),
          },
        });
      });

      // ScreenSpaceEventHandler for Marker Interaction
      const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

      handler.setInputAction((movement: any) => {
        const pickedObject = scene.pick(movement.position);
        if (Cesium.defined(pickedObject) && pickedObject.id) {
          const entityId = pickedObject.id.id;
          const loc = STRATEGIC_LOCATIONS.find((l) => l.id === entityId);
          if (loc) {
            setSelectedLocation(loc);
            flyToLocation(loc, 1.8);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Camera change listener for live compass & heading updates
      viewer.camera.changed.addEventListener(() => {
        const headingDeg = Cesium.Math.toDegrees(viewer.camera.heading);
        const pitchDeg = Cesium.Math.toDegrees(viewer.camera.pitch);
        setCurrentHeading(headingDeg);
        setCurrentPitch(pitchDeg);
      });

      // Initial Cinematic View to Aracruz
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          CAMERA_PRESETS.overview.longitude,
          CAMERA_PRESETS.overview.latitude,
          CAMERA_PRESETS.overview.range
        ),
        orientation: {
          heading: Cesium.Math.toRadians(CAMERA_PRESETS.overview.heading),
          pitch: Cesium.Math.toRadians(CAMERA_PRESETS.overview.pitch),
          roll: 0.0,
        },
      });

      // Smooth initial fly into Area 03
      window.setTimeout(() => {
        flyToPreset('terreno', 2.8);
        setIsLoading(false);
      }, 900);

    } catch (err: any) {
      console.error('Cesium init error:', err);
      setHasWebGLError(true);
      setErrorMessage(err?.message || 'Falha ao inicializar o contexto WebGL.');
      setIsLoading(false);
    }

    // Cleanup on unmount
    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
      viewerRef.current = null;
    };
  }, [flyToLocation, flyToPreset]);

  // Toggle labels visibility
  const toggleLabels = () => {
    const nextVal = !showLabels;
    setShowLabels(nextVal);
    if (!viewerRef.current) return;

    STRATEGIC_LOCATIONS.forEach((loc) => {
      const entity = viewerRef.current.entities.getById(loc.id);
      if (entity && entity.billboard) {
        entity.billboard.show = nextVal;
      }
    });
  };

  // Toggle connection corridors visibility
  const toggleCorridors = () => {
    const nextVal = !showCorridors;
    setShowCorridors(nextVal);
    if (!viewerRef.current) return;

    LOGISTIC_CORRIDORS.forEach((c) => {
      const entity = viewerRef.current.entities.getById(c.id);
      if (entity && entity.polyline) {
        entity.polyline.show = nextVal;
      }
    });
  };

  return (
    <div className={`relative bg-[#0A1118] overflow-hidden ${className}`}>
      {/* 3D Map Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0A1118]/90 backdrop-blur-md text-white transition-opacity duration-500">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#FF6A1A]/30 animate-ping" />
            <div className="w-12 h-12 rounded-full border-2 border-t-[#FF6A1A] border-r-transparent border-b-cyan-400 border-l-transparent animate-spin" />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF6A1A]">
            LOCALIZANDO EMPREENDIMENTO
          </span>
          <p className="text-sm font-medium text-slate-300 mt-1">{loadingText}</p>
        </div>
      )}

      {/* Fallback Screen for WebGL Error */}
      {hasWebGLError && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0E1923] p-6 text-center text-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            Suporte 3D Limitado no Navegador
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Seu navegador ou dispositivo não oferece suporte completo à aceleração WebGL necessária para o globo 3D.
            {errorMessage && <span className="block mt-2 font-mono text-[10px] text-slate-500">{errorMessage}</span>}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-[#FF6A1A] text-white text-xs font-bold hover:bg-[#e5590f] transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Top Floating Control Bar (Persistent shortcuts) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-auto flex-wrap">
        <button
          type="button"
          onClick={() => flyToPreset('terreno')}
          className="px-3.5 py-2 rounded-xl bg-[#0E1923]/92 hover:bg-[#FF6A1A] border border-slate-700/80 text-white text-xs font-bold flex items-center gap-2 shadow-xl transition-all duration-200 group active:scale-95"
          title="Centralizar e retornar ao terreno da Área 03"
        >
          <Home className="w-4 h-4 text-[#FF6A1A] group-hover:text-white transition-colors" />
          <span>Voltar ao Terreno</span>
        </button>

        <button
          type="button"
          onClick={() => flyToPreset('overview')}
          className="px-3.5 py-2 rounded-xl bg-[#0E1923]/92 hover:bg-slate-700 border border-slate-700/80 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 shadow-xl transition-all active:scale-95"
          title="Ver o complexo regional por inteiro"
        >
          <Maximize2 className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Visão Geral</span>
        </button>

        <button
          type="button"
          onClick={toggleLabels}
          className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-xl transition-all ${
            showLabels
              ? 'bg-[#0E1923]/92 border-slate-700/80 text-slate-200 hover:bg-slate-700'
              : 'bg-slate-800/80 border-slate-700/40 text-slate-400'
          }`}
          title={showLabels ? 'Ocultar marcadores' : 'Exibir marcadores'}
        >
          {showLabels ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Rótulos</span>
        </button>

        <button
          type="button"
          onClick={toggleCorridors}
          className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-xl transition-all ${
            showCorridors
              ? 'bg-[#0E1923]/92 border-slate-700/80 text-slate-200 hover:bg-slate-700'
              : 'bg-slate-800/80 border-slate-700/40 text-slate-400'
          }`}
          title={showCorridors ? 'Ocultar linhas logísticas' : 'Exibir linhas logísticas'}
        >
          <GitBranch className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Corredores</span>
        </button>
      </div>

      {/* Camera Navigation Controls (D-pad, Pan, Tilt, Rotate, Zoom) */}
      <CameraControls
        onAction={handleCameraAction}
        currentHeading={currentHeading}
        currentPitch={currentPitch}
        isTourActive={isTourActive}
      />

      {/* Strategic Locations Drawer (Sidebar / Bottom sheet) */}
      <LocationDrawer
        locations={STRATEGIC_LOCATIONS}
        activeLocationId={selectedLocation?.id}
        onSelectLocation={(loc) => flyToLocation(loc)}
        isOpen={isDrawerOpen}
        onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
      />

      {/* Active Location Info Card */}
      {selectedLocation && !isTourActive && (
        <LocationCard
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onFocus={(loc) => flyToLocation(loc)}
        />
      )}

      {/* Tour Bar Controller & Narrations */}
      <TourBar
        isTourActive={isTourActive}
        isPaused={isTourPaused}
        currentStopIndex={currentStopIndex}
        totalStops={TOUR_STOPS.length}
        currentStop={TOUR_STOPS[currentStopIndex]}
        onStartTour={handleStartTour}
        onPauseTour={handlePauseTour}
        onResumeTour={handleResumeTour}
        onNextStop={handleNextStop}
        onPrevStop={handlePrevStop}
        onRestartTour={handleRestartTour}
        onExitTour={handleExitTour}
      />
    </div>
  );
};
