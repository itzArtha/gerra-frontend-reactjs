import MainButton from "../../../MainButton";
import TablePengurus from "../components/TablePengurus";
import MainModal from "../../../modals/MainModal";
import MainSearch from "../../../MainSearch";
import Label from "../../../Label";
import { useCallback, useState } from "react";
import apiClient from "../../../services/apiClient";
import IconWithTitle from "../../IconWithTitle";
import Checkbox from "../../../Checkbox";
import SelectInput from "../../../SelectInput";

const Pengurus = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [choosePart, setChoosePart] = useState([]);
  const [loading, setLoading] = useState(true);

  const callback = useCallback((search) => {
    setSearch(search);
  }, []);

  const handleOpenAddModal = () => {
    const fetchPartSearch = async () => {
      await apiClient
        .get("/api/v1/user/search")
        .then((response) => {
          setAllUsers(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          //
        });
    };
    fetchPartSearch();
    setShowModal(true);
  };

  const filteredPersons = allUsers.filter((person) => {
    return person.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelectPart = (e) => {
    const id = e.target.value;
    const res = allUsers.filter((i) => i.id === parseInt(id))[0];
    let newArray = [{ id, res }];
    if (choosePart.filter((i) => i.id === id).length > 0) {
      newArray = newArray.filter((i) => i.id !== id);
    }
    setChoosePart(newArray);
    // console.log(newArray);
  };

  return (
    <>
      <MainModal
        title={"Tambah pengurus di event ini"}
        showModal={showModal}
        onClick={() => {
          //
        }}
        buttonLabel={"Tambahkan"}
        handleClose={() => {
          setShowModal(false);
        }}
      >
        <div className="flex justify-end">
          <Label
            label={`Dipilih: ${choosePart.map((item) => item.res.name)}`}
          />
        </div>
        <MainSearch
          searchCallback={callback}
          placeholder={"Cari pengurus..."}
        />
        <div>
          <div className="overflow-auto h-64">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredPersons.map((item, i) => (
                <label
                  key={i}
                  htmlFor={`addTeamCheck${i}`}
                  className={`my-2 border ${
                    choosePart.filter(
                      (c) => parseInt(c.id) === parseInt(item.id)
                    ).length > 0
                      ? "border-yellow-400 "
                      : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <IconWithTitle
                      title={item.name}
                      loading={loading}
                      className="m-4"
                      icon={
                        <img
                          className="w-10 h-10 rounded-full object-cover"
                          src={loading ? "" : item.photo_url}
                          alt="Icon"
                        />
                      }
                    />
                    <Checkbox
                      checked={
                        choosePart.filter(
                          (c) => parseInt(c.id) === parseInt(item.id)
                        ).length > 0
                          ? true
                          : false
                      }
                      onChange={handleSelectPart}
                      value={item.id}
                      className="my-4"
                      id={`addTeamCheck${i}`}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        {choosePart.length === 1 ? (
          <div className="mt-8">
            <Label
              label={`Jabatan untuk ${choosePart.map((item) => item.res.name)}`}
            />
            <SelectInput>
              <option value="1">Admin</option>
            </SelectInput>
          </div>
        ) : (
          ""
        )}
      </MainModal>
      <div className="my-4 flex justify-end">
        <MainButton
          onClick={() => {
            handleOpenAddModal();
          }}
          label="Tambah Pengurus"
        />
      </div>
      <div title="table" className="my-4">
        <TablePengurus />
      </div>
    </>
  );
};
export default Pengurus;
