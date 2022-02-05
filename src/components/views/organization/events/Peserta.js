import MainButton from "../../../MainButton";
import TablePeserta from "../components/TablePeserta";

const Peserta = () => {
  return (
    <div>
      <div className="my-4 flex justify-end">
        <MainButton label="Export Data" />
      </div>
      <div title="table" className="my-4">
        <TablePeserta />
      </div>
    </div>
  );
};
export default Peserta;
