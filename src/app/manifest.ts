import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Racha aí",
    short_name: "Racha aí",
    description: "Racha aí",
    start_url: "/app",
    display: "standalone",
    background_color: "#000",
    theme_color: "#000",
    icons: [],
    dir: "ltr",
    display_override: ["standalone"],
  };
}
