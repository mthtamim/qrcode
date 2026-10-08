declare module "qrcode" {
  export type QRErrorCorrectionLevel = "L" | "M" | "Q" | "H";

  export interface QRCodeRenderOptions {
    type?: "svg" | "utf8" | "terminal";
    errorCorrectionLevel?: QRErrorCorrectionLevel;
    margin?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  export interface QRCode {
    version: number;
  }

  interface QRCodeApi {
    create(
      text: string,
      options?: { errorCorrectionLevel?: QRErrorCorrectionLevel },
    ): QRCode;
    toDataURL(text: string, options?: QRCodeRenderOptions): Promise<string>;
    toString(text: string, options?: QRCodeRenderOptions): Promise<string>;
  }

  const QRCode: QRCodeApi;
  export default QRCode;
}
