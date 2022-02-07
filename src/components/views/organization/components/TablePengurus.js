import moment from "moment";
import { useState } from "react";
import handleSwal from "../../../handleSwal";
import Label from "../../../Label";
import MainButton from "../../../MainButton";
import MainInput from "../../../MainInput";
import MainModal from "../../../modals/MainModal";
import SelectInput from "../../../SelectInput";
import apiClient from "../../../services/apiClient";

const TablePengurus = ({ data, clickCallback }) => {
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    customId: "",
    roles: "0",
    userId: "",
    userName: "",
    Id: "",
  });

  const editOrganizer = (id) => {
    setBtnLoading(true);
    apiClient
      .put("/api/v1/organization/event/organizer/" + id, {
        custom_id: formData.customId,
        roles: formData.roles,
      })
      .then((response) => {
        clickCallback();
        setBtnLoading(false);
        setShowModalEdit(false);
        handleSwal(response.data.message);
      })
      .catch((error) => {
        handleSwal(error.response.data.message, "error");
        setBtnLoading(false);
      });
  };

  const kickOrganizer = (id) => {
    setBtnLoading(true);
    apiClient
      .delete("/api/v1/organization/event/organizer/" + id)
      .then((response) => {
        clickCallback();
        setBtnLoading(false);
        setShowModalDelete(false);
        handleSwal(response.data.message);
      })
      .catch((error) => {
        clickCallback();
        handleSwal(error.response.data.message, "error");
        setBtnLoading(false);
      });
  };

  const handleDeleteModal = (id) => {
    setShowModalDelete(true);
    const newArray = data.filter((item) => item.id === id)[0];
    setFormData({
      userName: newArray.name,
      Id: id,
    });
  };

  const handleEditModal = (id) => {
    setShowModalEdit(true);
    const newArray = data.filter((item) => item.id === id)[0];
    setFormData({
      customId: newArray.custom_id,
      roles: newArray.roles,
      userName: newArray.name,
      Id: id,
    });
  };

  return (
    <div className="flex flex-col">
      {/* Delete Modal */}
      <MainModal
        title={`Kick ${formData.userName}?`}
        showModal={showModalDelete}
        onClick={() => {
          kickOrganizer(formData.Id);
        }}
        buttonLabel={btnLoading ? "Loading..." : "Kick"}
        handleClose={() => {
          setShowModalDelete(false);
        }}
      >
        <p>Udah yakin mau kick {formData.userName}? Nanti nyesel lohh</p>
      </MainModal>
      {/* Edit Modal */}
      <MainModal
        title={"Edit pengurus di event ini"}
        showModal={showModalEdit}
        onClick={() => {
          editOrganizer(formData.Id);
        }}
        buttonLabel={btnLoading ? "Loading..." : "Edit"}
        handleClose={() => {
          setShowModalEdit(false);
        }}
      >
        <div>
          <div className="mt-8">
            <Label label={`Jabatan untuk ${formData.userName}`} />
            <SelectInput
              value={formData.roles}
              onChange={(e) => {
                setFormData({ ...formData, roles: e.target.value });
              }}
            >
              <option key="0" value="0">
                Admin
              </option>
              <option key="1" value="1">
                Anggota
              </option>
            </SelectInput>
            <Label label={`Custom ID untuk ${formData.userName}`} />
            <MainInput
              value={formData.customId}
              onChange={(e) => {
                setFormData({ ...formData, customId: e.target.value });
              }}
              placeholder="NIM/NIS/NIP/NIK"
            />
          </div>
        </div>
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
                    ID Pengurus
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Jabatan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Waktu Bergabung
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((person) => (
                  <tr key={person.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {person.custom_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={person.photo_url}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {person.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {person.roles === 0 ? "Admin" : "Anggota"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {moment(person.join_at).format("lll")}
                      </div>
                    </td>
                    <td className="py-4 px-2 whitespace-nowrap text-right text-sm font-medium">
                      <MainButton
                        onClick={() => {
                          handleEditModal(person.id);
                        }}
                        className="w-full"
                        label="Edit"
                      />
                    </td>
                    <td className="py-4 pr-6 whitespace-nowrap text-right text-sm font-medium">
                      <MainButton
                        onClick={() => {
                          handleDeleteModal(person.id);
                        }}
                        className="w-full"
                        label="Kick"
                      />
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
export default TablePengurus;
