import Footer from '../components/footer';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="flox-col mx-auto my-4 flex w-max text-center">
        <a href="https://www.streetsforall.org/">
          <img src="/images/SFA_logo_wide.png" className="w-80 max-w-full" />
        </a>
      </div>

      <div className="bg-bg m-auto mt-12 w-[calc(100%-2rem)] max-w-xl rounded-2xl p-4 text-center text-xl">
        <h2>Not Found</h2>

        <p>Sorry, but the page you&apos;re looking for doesn&apos;t exist.</p>
      </div>

      <Footer />
    </div>
  );
}
