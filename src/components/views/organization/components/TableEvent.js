import moment from "moment";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import MainModal from "../../../modals/MainModal";

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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Judul
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Lokasi
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Kategori
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Waktu
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, i) => (
                  <tr key={i}>
                    <Link to={`/explore/event/${item.slug}`}>
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={item.banner_url}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.owner}
                            </div>
                          </div>
                        </div>
                      </td>
                    </Link>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.location}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.is_online ? "Online" : "Offline"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.category}
                      </div>
                      <div className="text-sm text-gray-500">{item.format}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="font-semibold">Start at</span>{" "}
                        {moment(item.start_at).format("lll")}
                      </div>
                      <div className="text-sm text-gray-900">
                        <span className="font-semibold">End at</span>{" "}
                        {moment(item.end_at).format("lll")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === 0
                          ? "Draf"
                          : item.status === 1
                          ? "Aktif"
                          : "Berakhir"}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a target={`__blank`} href={`/admin/event/${item.slug}`}>
                        <p className="text-green-600 hover:text-green-900 cursor-pointer">
                          Dashboard
                        </p>
                      </a>
                    </td>
                    <td
                      className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium"
                      onClick={() => {
                        history.push(`/manage/event/${item.slug}`);
                      }}
                    >
                      <p className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                        Edit
                      </p>
                    </td>
                    <td
                      className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium"
                      onClick={() => {
                        setShowModal(true);
                        setdeleteID(item.slug);
                      }}
                    >
                      <p className="text-red-600 hover:text-red-900 cursor-pointer">
                        Delete
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TableEvent;
