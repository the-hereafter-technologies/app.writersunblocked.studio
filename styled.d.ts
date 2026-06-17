// styled.d.ts
import "styled-components";
import type { SiteTheme } from "./src/theme/types";

declare module "styled-components" {
  export interface DefaultTheme extends SiteTheme {}
}
