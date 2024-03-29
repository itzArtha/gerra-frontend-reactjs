import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <footer className="bg-white dark:bg-gray-800 bottom-0 left-0 relative w-full">
        <div className="pt-8 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#F0AD00"
              fillOpacity="1"
              d="M0,64L40,64C80,64,160,64,240,85.3C320,107,400,149,480,144C560,139,640,85,720,90.7C800,96,880,160,960,154.7C1040,149,1120,75,1200,64C1280,53,1360,107,1400,133.3L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
            />
          </svg>
          <p className="absolute font-semibold bottom-2 left-2 text-xs md:text-base">
            Copyright Tokoevent {new Date().getFullYear()}
          </p>
          <div className={"absolute flex gap-3 bottom-2 right-2"}>
            {/*            <a
              target="_blank"
              rel="noreferrer"
              href="mailto:ternakayam.company@gmail.com"
            >
              <p className="">
                <img
                  className={"w-10 h-10"}
                  src={process.env.PUBLIC_URL + "/email.svg"}
                />
              </p>
            </a>*/}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/tokoevent"
            >
              <p className="mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Bold"
                  enableBackground="new 0 0 24 24"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="m12.004 5.838c-3.403 0-6.158 2.758-6.158 6.158 0 3.403 2.758 6.158 6.158 6.158 3.403 0 6.158-2.758 6.158-6.158 0-3.403-2.758-6.158-6.158-6.158zm0 10.155c-2.209 0-3.997-1.789-3.997-3.997s1.789-3.997 3.997-3.997 3.997 1.789 3.997 3.997c.001 2.208-1.788 3.997-3.997 3.997z" />
                  <path d="m16.948.076c-2.208-.103-7.677-.098-9.887 0-1.942.091-3.655.56-5.036 1.941-2.308 2.308-2.013 5.418-2.013 9.979 0 4.668-.26 7.706 2.013 9.979 2.317 2.316 5.472 2.013 9.979 2.013 4.624 0 6.22.003 7.855-.63 2.223-.863 3.901-2.85 4.065-6.419.104-2.209.098-7.677 0-9.887-.198-4.213-2.459-6.768-6.976-6.976zm3.495 20.372c-1.513 1.513-3.612 1.378-8.468 1.378-5 0-7.005.074-8.468-1.393-1.685-1.677-1.38-4.37-1.38-8.453 0-5.525-.567-9.504 4.978-9.788 1.274-.045 1.649-.06 4.856-.06l.045.03c5.329 0 9.51-.558 9.761 4.986.057 1.265.07 1.645.07 4.847-.001 4.942.093 6.959-1.394 8.453z" />
                  <circle cx="18.406" cy="5.595" r="1.439" />
                </svg>
              </p>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
