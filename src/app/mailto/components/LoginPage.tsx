'use client';

import { RefObject, SubmitEventHandler } from 'react';
import Image from 'next/image';

export default function LoginPage({
  validateAction,
  pwdInputRef,
}: {
  validateAction: SubmitEventHandler<HTMLFormElement>;
  pwdInputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center">
      <div className="-mt-48 flex flex-col items-center">
        <Image
          src="/SFA_logo_wide.png"
          alt="Streets For All logo"
          height={0}
          width={240}
          className="mb-12 h-auto bg-black"
        />

        <h1 className="font-title mb-8 text-2xl font-bold">
          Log in to the mailto tool
        </h1>

        {/* Form */}
        <form
          className="flex w-sm max-w-screen flex-col gap-6 border-2 border-black bg-white p-8"
          onSubmit={(event) => validateAction(event)}
        >
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={pwdInputRef} />
          </div>
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}
