/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';

/**
 * Children will be never missing again!
 *
 * This component wraps your tree in a safe manner: Once rendered,
 * it will check the root app tree. If NOTHING was rendered, a panic
 * screen is displayed in order to make the developer aware that something
 * broke, but no error or excepcional state is found.
 */
export default function AppGuard({ children }: any) {
  const [error, setError] = useState<any>(null);
  // Check once //
  useEffect(() => {
    const len = document.getElementById('root')?.innerHTML?.trim()?.length ?? 0;
    if (len <= 0) {
      // Crash if nothing was rendered! //
      setError(
        <div id="panic" className="flex justify-center content-center flex-col h-full text-center">
          <h1 className="text-red-600 text-9xl">PANIC</h1>
          <p className="text-red-700 text-xl m-5">
            Nothing was rendered! The whole app view tree is <b>empty!</b>
          </p>
          <code>This results in a no-op, but consider the app broken somewhere!</code>
          <code>
            Suggestion: Lookup in the provider stack or other guards before the real UI render.
          </code>
        </div>
      );
    }
  }, []);
  return error ?? children;
}
