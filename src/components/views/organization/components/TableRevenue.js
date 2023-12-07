import CurrencyFormat from "react-currency-format";
import moment from "moment";
import DataTable from "react-data-table-component";

const TableRevenue = ({ data }) => {
  const columns = [
    {
      name: "#",
      selector: (row) => row.no,
      sortable: true,
      width: "30px",
      right: true,
      compact: true,
    },
    {
      name: "Nama Tiket",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Jumlah",
      selector: (row) => row.amount,
      sortable: true,
      format: (row) => (
        <CurrencyFormat
          value={row.amount}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"Rp"}
        />
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      format: (row) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status.color}`}
        >
          {row.status.label}
        </span>
      ),
    },
    {
      name: "Tanggal",
      selector: (row) => row.created_at,
      sortable: true,
      format: (row) => moment(row.created_at).format("lll"),
    },
  ];

  const items = data.map((revenue, key) => {
    return {
      no: key + 1,
      title: revenue.title,
      amount: revenue.amount,
      status: revenue.status,
      created_at: revenue.created_at,
    };
  });

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <div className="min-w-full divide-y divide-gray-200">
              <DataTable columns={columns} data={items} pagination={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TableRevenue;
