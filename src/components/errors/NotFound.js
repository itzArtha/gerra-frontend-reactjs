import MainButton from "../MainButton";

const NotFound = () => {
    return(
        <>
            <div className={"text-center"}>
                <div className={"flex justify-center"}>
                    <img src={process.env.PUBLIC_URL + "/broken-heart.svg"} alt={"Icon"} />
                </div>
                <div className={"flex justify-center"}>
                    <h2 className={"font-semibold text-2xl"}>Uwaaa, halaman yang kamu cari tidak ditemukan</h2>
                </div>
                <div className={"flex justify-center my-12"}>
                    <MainButton onClick={() => {
                        window.location.href = "/";
                    }} label={"Kembali Ke Dashboard"} />
                </div>
            </div>
        </>
    )
}
export default NotFound;