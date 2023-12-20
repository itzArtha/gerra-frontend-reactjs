import moment from "moment";
import { useState } from "react";
import CurrencyFormat from "react-currency-format";
import DataTable from "react-data-table-component";

const TablePresensi = ({ data }) => {
  const items = data.map((presence, key) => {
    return {
      no: key + 1,
      id: presence.id,
      user: {
        name: presence.name,
        image: presence.photo_url,
      },
      ticket_name: presence.ticket_name,
      email: presence.email,
      presence_at: presence.presence_at,
    };
  });

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
      name: "Nomor Tiket",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Nama Tiket",
      selector: (row) => row.ticket_name,
      sortable: true,
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
      name: "Tanggal Presensi",
      selector: (row) => row.presence_at,
      sortable: true,
      format: (row) => moment(row.presence_at).format("lll"),
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
export default TablePresensi;
