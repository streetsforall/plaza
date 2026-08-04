import Image from 'next/image';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn } from '@/lib/auth';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // Retrieve URL params from promise
  const callbackUrl = (await searchParams).callbackUrl;
  const errorCode = (await searchParams).error;

  // Translate error codes to messages
  let errorMessage;
  if (errorCode) {
    switch (errorCode) {
      case 'CredentialsSignin':
        errorMessage = 'Incorrect password';
        break;
      default:
        errorMessage = 'Sorry, something went wrong.';
    }
  }

  return (
    <div className="mt-32 flex flex-col items-center justify-center">
      <Image
        src="/SFA_logo_wide.png"
        alt="Streets For All logo"
        height={0}
        width={240}
        loading="eager"
        className="mb-12 h-auto bg-black"
      />

      <h1 className="font-title mb-8 text-2xl font-bold">
        Log in to the mailto tool
      </h1>

      {/* Form */}
      <form
        className="flex w-sm max-w-screen flex-col gap-6 border-2 border-black bg-white p-8"
        action={async (formData) => {
          'use server';
          try {
            // Use password from from and redirect to URL specified in param
            await signIn('credentials', {
              password: formData.get('password'),
              redirectTo: callbackUrl ?? '',
            });
          } catch (error) {
            // If auth error, append code to URL
            if (error instanceof AuthError) {
              return redirect(
                `?error=${error.type}${callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`,
              );
            }
            throw error;
          }
        }}
      >
        {errorMessage && (
          <div className="rounded-sm bg-red-700 p-2 px-4 text-sm text-white">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
