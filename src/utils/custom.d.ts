// custom.d.ts
import { Request } from "express";

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}



// tsconfig.json - just in case id does not work
// {
//     "include": [
//         "custom.d.ts",
        // otros archivos o directorios aquí...
//     ]
// }
