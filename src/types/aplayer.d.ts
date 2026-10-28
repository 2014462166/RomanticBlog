declare module "aplayer" {
  export interface APlayerAudio {
    name: string;
    artist: string;
    url: string;
    cover?: string;
    lrc?: string;
  }

  export interface APlayerOptions {
    container: HTMLElement;
    fixed?: boolean;
    autoplay?: boolean;
    theme?: string;
    loop?: string;
    order?: string;
    preload?: string;
    volume?: number;
    mutex?: boolean;
    audio: APlayerAudio[];
    listFolded?: boolean;
    listMaxHeight?: string;
  }

  export default class APlayer {
    constructor(options: APlayerOptions);
    destroy(): void;
  }
}
