import MainLayout from "../../layouts/MainLayout";

const HowItWorks = () => {
  const ways = [
    {
      title: "Login/Registrasi",
      description:
        "Login sebagai pengguna kalo mau beli tiket, kalo belum daftar bisa dah klik daftar dulu ya. Sebenernya gausah dijelasin ga si, ini pasti kamu dah ngerti deh",
    },
    {
      title: "Pilih event yang mau diikuti",
      description: "Pilih dah sesuai kata hatimu yang mana",
    },
    {
      title: "Lihat detail event",
      description:
        "Simpel aja kayak Shop*e atau to*kope*dia alurnya kok, nanti ada tombol beli ya klik beli",
    },
    {
      title: "Pilih tiket",
      description:
        "Abis klik beli pasti ada pilihan tiket tu maksimal 3 tiket sih aku batesin, pilih dah abistu isi data diri inget ya sayang",
    },
    {
      title: "Checkout & bayar",
      description:
        "Checkout dong abis lengkapin data, abistu pilih metode pembayaran. Aku kasi 2 pilihan dulu sih, kalo rame lanjut part 2. Nanti kalo udah klik bayar keliatan tu nomor VA atau QRIS nanti, ya bayar kaya biasa aja",
    },
    {
      title: "Ambil tiket",
      description:
        "Abis bayar ni kan, kamu diemin aja di page 'Menunggu Pembayaran' nanti dia ngarah sendiri kok ke tiketnya, kalo udah ni kamu bisa liat detail tiketnya gitu, kayak link zoom tu udah ada disana kok",
    },
  ];

  return (
    <MainLayout>
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
        <h2 className="font-semibold text-3xl my-8">How it Works?</h2>
        <div className={"flex justify-center gap-4"}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/VS2aUsQlLJ8"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/7oPovYnX1vI"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-2">
          {ways.map((item, i) => (
            <div key={i} className={`step-${i} my-12`}>
              <div className="circle h-16 w-16 rounded-full absolute bg-yellow-400 p-3 border-black border">
                <span className="font-semibold text-3xl">{i + 1}</span>
              </div>
              <div className="images p-4">
                <div className="h-64 w-full bg-gray-400" />
              </div>
              <div className="text">
                <h2 className="font-semibold text-lg my-2">{item.title}</h2>
                <div>
                  <span>{item.description}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
export default HowItWorks;
