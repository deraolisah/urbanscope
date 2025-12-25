import acmeLogo from "../../assets/logo-acme.png";
import quantumLogo from "../../assets/logo-quantum.png";
import echoLogo from "../../assets/logo-echo.png";
import celestialLogo from "../../assets/logo-celestial.png";
import pulseLogo from "../../assets/logo-pulse.png";
import apexLogo from "../../assets/logo-apex.png";


const LogoTicker = () => {

  return (
    <div className='py-8 md:py-12'>
      <div className='container'>
        <div className='flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]'>
          <div className='w-full flex flex-none items-center justify-between gap-2 mx-auto'>
            <img src={acmeLogo} alt='Acme Logo' className='logo-ticker-img' />
            <img src={quantumLogo} alt='Quantum Logo' className='logo-ticker-img' />
            <img src={echoLogo} alt='Echo Logo' className='logo-ticker-img' />
            <img src={celestialLogo} alt='Celestial Logo' className='logo-ticker-img' />
            <img src={pulseLogo} alt='Pulse Logo' className='logo-ticker-img' />
            <img src={apexLogo} alt='Apex Logo' className='logo-ticker-img' />
          </div>
        </div>
      </div>
    </div>
  );
};


export default LogoTicker;