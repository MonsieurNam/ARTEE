// types/fabric-custom.d.ts
import 'fabric';

declare module 'fabric' {
  namespace fabric {
    // Mở rộng interface Object (đối tượng cơ sở)
    interface Object {
      data?: {
        id: string;
        side: string;
        isLocked?: boolean;
      };
    }
  }
}