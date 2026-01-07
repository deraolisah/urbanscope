import acmeLogo from "../../assets/logo-acme.png";
import quantumLogo from "../../assets/logo-quantum.png";
import echoLogo from "../../assets/logo-echo.png";
import celestialLogo from "../../assets/logo-celestial.png";
import pulseLogo from "../../assets/logo-pulse.png";
import apexLogo from "../../assets/logo-apex.png";

const logos = [
  acmeLogo,
  quantumLogo,
  echoLogo,
  celestialLogo,
  pulseLogo,
  apexLogo,
];

const LogoTicker = () => {
  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <div className="flex w-max animate-logo-ticker">
            {/* First set */}
            {logos.map((logo, i) => (
              <img
                key={`logo-1-${i}`}
                src={logo}
                alt="Partner logo"
                className="logo-ticker-img"
              />
            ))}

            {/* Duplicate set */}
            {logos.map((logo, i) => (
              <img
                key={`logo-2-${i}`}
                src={logo}
                alt="Partner logo"
                className="logo-ticker-img"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoTicker;
