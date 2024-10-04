import moment from "moment";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import MainModal from "../../../modals/MainModal";
import CurrencyFormat from "react-currency-format";
import DataTable from "react-data-table-component";
import MainButton from "../../../MainButton";
import MainBox from "./MainBox";

const TableEvent = ({ callback, data }) => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [deleteID, setdeleteID] = useState("");

  const handleCallback = (id) => {
    callback(id);
    setShowModal(false);
  };

  const handleDelete = () => {
    handleCallback(deleteID);
  };

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
      name: "Nama Event",
      selector: (row) => row.title,
      sortable: true,
      format: (item) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={item.title.banner_url}
              alt=""
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {item.title.label}
            </div>
            <div className="text-sm text-gray-500">{item.owner}</div>
          </div>
        </div>
      ),
    },
    {
      name: "Lokasi",
      selector: (row) => row.location,
      sortable: true,
      format: (item) => (
        <div>
          <div className="text-sm text-gray-900">{item.location.label}</div>
          <div className="text-sm text-gray-500">
            {item.location.is_online ? "Online" : "Offline"}
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status_label,
      sortable: true,
      format: (row) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status_label.color}`}
        >
          {row.status_label.label}
        </span>
      ),
    },
    {
      name: "Tanggal Dibuat",
      selector: (row) => row.created_at,
      sortable: true,
      format: (row) => moment(row.created_at).format("lll"),
    },
  ];

  const items = data.map((event, key) => {
    return {
      no: key + 1,
      slug: event.slug,
      title: {
        label: event.title,
        banner_url: event.banner_url,
      },
      location: {
        label: event.location,
        is_online: event.is_online,
      },
      status_label: {
        color: event.status_label.color,
        label: event.status_label.label,
      },
      created_at: event.created_at,
      total_participants: event.total_participants,
      total_sales: event.total_sales,
    };
  });

  const ExpandedComponent = ({ data }) => (
    <div className={"p-4"}>
      <div className={"grid grid-cols-2 gap-2"}>
        <div>
          <MainBox className="bg-indigo-400 hover:bg-indigo-300 pt-8">
            <div className="font-semibold text-5xl pb-4">
              {data.total_participants}
            </div>
            <div className="font-light text-lg pt-4">Total peserta</div>
          </MainBox>
        </div>
        <div>
          {/*         <MainBox className="bg-red-400 hover:bg-red-300 pt-8">
            <div className="font-semibold text-5xl pb-4">
              <CurrencyFormat
                value={data.total_sales}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp"}
              />
            </div>
            <div className="font-light text-lg pt-4">Total penjualan tiket</div>
          </MainBox>*/}
        </div>
      </div>
      <div className={"text-center mt-2"}>
        <MainButton
          label={"Lihat Preview"}
          className={"m-1"}
          onClick={() => {
            return window.open(`/explore/event/${data.slug}`);
          }}
        />
        <MainButton
          label={"Lihat Peserta"}
          className={"m-1"}
          onClick={() => {
            return window.open(`/admin/event/${data.slug}?tab=peserta`);
          }}
        />
        <MainButton
          label={"Lihat Penjualan"}
          className={"m-1"}
          onClick={() => {
            return window.open(`/admin/event/${data.slug}?tab=penjualan`);
          }}
        />
        <MainButton
          label={"Edit Event"}
          className={"m-1"}
          onClick={() => {
            return window.open(`/manage/event/${data.slug}`);
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      <MainModal
        handleClose={() => {
          setShowModal(false);
        }}
        buttonLabel={"Iii yakin bgtt"}
        showModal={showModal}
        onClick={handleDelete}
        title="Dah yakin mo ngapus?"
      >
        Gabisa dikembaliin lagi lo...
      </MainModal>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <DataTable
              columns={columns}
              data={items}
              pagination={true}
              expandableRows
              expandableRowsComponent={ExpandedComponent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TableEvent;
