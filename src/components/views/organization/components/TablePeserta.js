import moment from "moment";
import DataTable from "react-data-table-component";
import CurrencyFormat from "react-currency-format";
const TablePeserta = ({ data }) => {
  const items = data.map((presence, key) => {
    return {
      id: presence.id,
      reference: presence.reference,
      user: {
        name: presence.name,
        image: presence.photo_url,
      },
      email: presence.email,
      phone: presence.phone,
      nim: presence.nim,
      referral: presence.referral,
      ticket_name: presence.ticket_name,
      ticket_price: presence.ticket_price,
      created_at: presence.created_at,
      presence: presence.presence,
      presence_label: presence.presence.label,
    };
  });

  const columns = [
    {
      name: "No. Tiket",
      selector: (row) => row.reference,
      sortable: true,
      width: "120px",
    },
    {
      name: "Nama Tiket",
      selector: (row) => row.ticket_name,
      sortable: true,
    },
    {
      name: "Harga Tiket",
      selector: (row) => row.ticket_price,
      sortable: true,
      format: (row) => (
        <CurrencyFormat
          value={row.ticket_price}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"Rp"}
        />
      ),
    },
    {
      name: "Nama Peserta",
      selector: (row) => row.user,
      sortable: true,
      format: (row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={row.user.image}
              alt=""
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {row.user.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "No. Hp",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "NIM",
      selector: (row) => row.nim,
      sortable: true,
    },
    {
      name: "Referral",
      selector: (row) => row.referral,
      sortable: true,
    },
    {
      name: "Kehadiran",
      selector: (row) => row.presence_label,
      sortable: true,
      format: (row) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.presence.color}`}
        >
          {row.presence.label}
        </span>
      ),
    },

    {
      name: "Tanggal Registrasi",
      selector: (row) => row.created_at,
      sortable: true,
      format: (row) => moment(row.created_at).format("lll"),
    },
  ];

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
export default TablePeserta;
