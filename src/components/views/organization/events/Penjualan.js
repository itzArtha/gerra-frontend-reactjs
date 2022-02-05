import MainButton from "../../../MainButton";
import TablePenjualan from "../components/TablePenjualan";

const Penjualan = () => {
  return (
    <div>
      <div className="my-4 flex justify-end">
        <MainButton label="Export Data" />
      </div>
      <div title="table" className="my-4">
        <TablePenjualan />
      </div>
    </div>
  );
};
export default Penjualan;
