import Animation from "../components/Animation";

/**
 * Home hero section — full-screen banner with CTA buttons and a Lottie animation.
 */
export default function Home() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="Home"
      className="min-h-screen bg-gray-100 flex items-center pt-20 md:pt-10 lg:pl-10 lg:pr-10"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-5">

        {/* Left: text content */}
        <div className="space-y-5 md:space-y-8 text-center md:text-left">
          <span className="inline-block px-4 py-1 text-sm font-medium text-yellow-600 bg-red-100 rounded-full">
            New Collection 2026
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-700 leading-tight">
            Discover the Future of <br />
            <span className="text-orange-400">Onclick Shop</span>
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
            Experience a seamless and modern shopping platform designed
            to bring you the best products with just one click.
          </p>

          <div className="flex gap-4 justify-center md:justify-start">
            {/* Shop Now button */}
            <button
              type="button"
              onClick={() => scrollTo("Shop")}
              className="relative inline-flex items-center justify-center px-6 md:px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-orange-400 rounded-full group"
            >
              <span className="absolute w-0 h-0 transition-all duration-1000 ease-out bg-gray-800 rounded-full group-hover:w-56 group-hover:h-56" />
              <span className="absolute bottom-0 left-0 h-full -ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-full opacity-100 object-stretch" viewBox="0 0 487 487" aria-hidden="true">
                  <path fillOpacity=".1" fillRule="nonzero" fill="#FFF" d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z" />
                </svg>
              </span>
              <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="object-cover w-full h-full" viewBox="0 0 487 487" aria-hidden="true">
                  <path fillOpacity=".1" fillRule="nonzero" fill="#FFF" d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z" />
                </svg>
              </span>
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200" />
              <span className="relative text-sm md:text-base font-semibold">Shop Now</span>
            </button>

            {/* Contact button */}
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="relative inline-flex items-center justify-center px-6 md:px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-full group"
            >
              <span className="absolute w-0 h-0 transition-all duration-1000 ease-out bg-orange-400 rounded-full group-hover:w-56 group-hover:h-56" />
              <span className="absolute bottom-0 left-0 h-full -ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-full opacity-100 object-stretch" viewBox="0 0 487 487" aria-hidden="true">
                  <path fillOpacity=".1" fillRule="nonzero" fill="#FFF" d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z" />
                </svg>
              </span>
              <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="object-cover w-full h-full" viewBox="0 0 487 487" aria-hidden="true">
                  <path fillOpacity=".1" fillRule="nonzero" fill="#FFF" d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z" />
                </svg>
              </span>
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200" />
              <span className="relative text-sm md:text-base font-semibold">Contact</span>
            </button>
          </div>
        </div>

        {/* Right: Lottie animation */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40 -z-10" />
          <Animation />
        </div>

      </div>
    </section>
  );
}