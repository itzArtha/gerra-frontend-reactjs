import { useRef } from "react";
import MainLayout from "../../layouts/MainLayout";
import MainButton from "../../MainButton";
import NumberScroller from "number-scroller";

const About = () => {
  const founders = [
    {
      name: "Artha",
      pics: "https://assets-gerra.s3.ap-southeast-1.amazonaws.com/teams/artha.JPG",
      motto: "Lagi nyari chindo",
      level: "Yang buat, mikir, ngoding, & stress",
    },
    {
      name: "Yusa",
      pics: "https://assets-gerra.s3.ap-southeast-1.amazonaws.com/teams/yusa.jpeg",
      motto: "Maaf sedang self healing",
      level: "Nonton jojo pas meeting",
    },
    {
      name: "Krisna",
      pics: "https://assets-gerra.s3.ap-southeast-1.amazonaws.com/teams/krisna.jpeg",
      motto: "Antos, nu moto",
      level: "Ga ngapa-ngapain",
    },
    {
      name: "Mamet",
      pics: "https://assets-gerra.s3.ap-southeast-1.amazonaws.com/teams/mamet.JPG",
      motto: "Rahasia",
      level: "Masih kekeh sama nama watix",
    },
  ];

  const achievments = [
    {
      name: "Pengguna",
      amount: <NumberScroller to={118} timeout={1000} />,
      icon: process.env.PUBLIC_URL + "/meditation.svg",
    },
    {
      name: "Mitra",
      amount: <NumberScroller to={88} timeout={1000} />,
      icon: process.env.PUBLIC_URL + "/mitra.svg",
    },
    {
      name: "Event Terlaksana",
      amount: <NumberScroller to={12} timeout={1000} />,
      icon: process.env.PUBLIC_URL + "/rich.svg",
    },
  ];
  const contacts = [
    {
      name: "Email",
      link: "mailto:ternakayam.company@gmail.com",
      value: "ternakayam.company@gmail.com",
    },
    {
      name: "DM Instagram",
      link: "https://www.instagram.com/exotix.id",
      value: "exotix.id",
    },
    {
      name: "Email (Alternative)",
      link: "mailto:exovaindonesia@gmail.com",
      value: "exovaindonesia@gmail.com",
    },
  ];
  const scrollTentang = useRef(null);
  const scrollTim = useRef(null);
  const scrollPencapaian = useRef(null);
  const scrollContact = useRef(null);

  const handleScrollTentang = () => {
    scrollTentang.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollTim = () => {
    scrollTim.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollPencapaian = () => {
    scrollPencapaian.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleScrollContact = () => {
    scrollContact.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <MainLayout footer={true}>
      <div className="container px-6 py-16 mx-auto text-center">
        <div className="flex justify-center my-8">
          <img
            onClick={() => {
              window.location.href = "/";
            }}
            className="md:w-1/4 w-1/2 cursor-pointer"
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="Logo"
          />
        </div>
        <div className="buttons grid grid-cols-2 md:grid-cols-4 gap-2 justify-center">
          <MainButton onClick={handleScrollTentang} label="Tentang" />
          <MainButton onClick={handleScrollTim} label="Tim" />
          <MainButton onClick={handleScrollPencapaian} label="Pencapaian" />
          <MainButton onClick={handleScrollContact} label="Kontak" />
        </div>
        {/* Tentang */}
        <div className="about flex justify-center my-12" ref={scrollTentang}>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
            <div className="md:w-4/6 w-4/6 mx-auto md:ml-auto">
              <img src={process.env.PUBLIC_URL + "/surprise.svg"} alt="Icon" />
            </div>
            <div className="py-12">
              <h2 className="text-justify font-small text-xl mb-4">
                Exotix adalah platform trading, asekk. <br />
                <b>Trading tiket</b> atau jual beli tiket, disini kamu bisa
                menjual tiket misal organisasi kampus kamu mau jual tiket bisa
                disini aja. Dan yang pasti <b>paperless, mudah, dan cepat</b>{" "}
                <br /> <br />
                Gak cuma itu karena kamu disini bisa beli tiket dan dapet{" "}
                <b>promo2</b> juga, apalagi gen-z sekarang pemburu promo kan,
                ewh -_-
              </h2>
            </div>
          </div>
        </div>
        {/* Tim */}
        <div className="tim my-24" ref={scrollTim}>
          <h2 className="font-semibold text-3xl my-8">Petinggi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {founders.map((item, i) => (
              <div key={i} className={`founder-${i} my-8`}>
                <div className="w-40 h-40 mx-auto">
                  <img
                    className="w-40 h-40 object-cover rounded-full"
                    src={item.pics}
                    alt="PP"
                  />
                </div>
                <div className="my-4">
                  <h2 className="font-bold text-3xl">{item.name}</h2>
                </div>
                <div className="my-4">
                  <h2 className="font-light text-2xl">{item.motto}</h2>
                </div>
                <div className="mt-8">
                  <h2 className="font-semibold text-2xl">{item.level}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Pencapaian */}
        <div className="tim my-24" ref={scrollPencapaian}>
          <h2 className="font-semibold text-3xl my-8">Pencapaian</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {achievments.map((item, i) => (
              <div key={i} className={`founder-${i} my-8`}>
                <div className="md:w-5/6 w-full mx-auto">
                  <img className="w-full" src={item.icon} alt="Icon" />
                </div>
                <div className="my-4">
                  <h2 className="font-bold text-4xl">{item.amount}</h2>
                </div>
                <div className="my-4">
                  <h2 className="font-semibold text-xl">{item.name}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Kontak */}
        <div className="tim my-24" ref={scrollContact}>
          <h2 className="font-semibold text-3xl my-8">Kontak</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {contacts.map((item, i) => (
              <div key={i} className={`contact-${i} my-8`}>
                <div>
                  <span>
                    <span className={"font-light text-base"}>{item.name}</span>
                  </span>
                </div>
                <a
                  className={"text-blue-600 hover:text-blue-400 duration-500"}
                  href={item.link}
                  target={"_blank"}
                >
                  <span className={"font-bold text-lg"}>{item.value}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default About;
