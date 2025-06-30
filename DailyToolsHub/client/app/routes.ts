import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/converter", "routes/converter.tsx"),
  route("/video-converter", "routes/video-converter.tsx"),
  route("/video-download", "routes/video-download.tsx"),
  route("/utilities", "routes/utilities.tsx"),
] satisfies RouteConfig;
