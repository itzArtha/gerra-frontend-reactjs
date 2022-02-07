import MainButton from "../../../MainButton";
import TablePengurus from "../components/TablePengurus";
import MainModal from "../../../modals/MainModal";
import MainSearch from "../../../MainSearch";
import Label from "../../../Label";
import { useCallback, useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";
import IconWithTitle from "../../IconWithTitle";
import Checkbox from "../../../Checkbox";
import SelectInput from "../../../SelectInput";
import MainInput from "../../../MainInput";
import handleSwal from "../../../handleSwal";
import Skeleton from "../../../Skeleton";

const Pengurus = ({ slug }) => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [choosePart, setChoosePart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    customId: "",
    roles: "0",
    userId: "",
  });

  const clickCallback = useCallback(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [slug]);

  const fetchData = () => {
    apiClient
      .get("/api/v1/organization/event/organizer?eventid=" + slug)
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setData([]);
      });
  };

  const callback = useCallback(
    (search) => {
      setSearch(search);
      if (allUsers.length === 0) {
        fetchPartSearch();
      }
    },
    [allUsers]
  );

  const fetchPartSearch = async () => {
    setLoading(true);
    await apiClient.get("/api/v1/user/search").then((response) => {
      setAllUsers(response.data.data);
      setLoading(false);
    });
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
    setFormData({
      ...formData,
      userId: newArray.map((item) => item.res.id)[0],
    });
  };

  const addOrganizer = () => {
    setBtnLoading(true);
    apiClient
      .post("/api/v1/organization/event/organizer", {
        user_id: formData.userId,
        eventid: slug,
        custom_id: formData.customId,
        roles: formData.roles,
      })
      .then((response) => {
        fetchData();
        setBtnLoading(false);
        setShowModal(false);
      })
      .catch((error) => {
        handleSwal(error.response.data.message, "error");
        setBtnLoading(false);
      });
  };

  return (
    <>
      <MainModal
        title={"Tambah pengurus di event ini"}
        showModal={showModal}
        onClick={() => {
          addOrganizer();
        }}
        buttonLabel={btnLoading ? "Loading..." : "Tambahkan"}
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
          {loading && allUsers.length === 0 ? (
            <span className="flex justify-center">Loading...</span>
          ) : (
            ""
          )}
          <div className="overflow-auto h-48">
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
                    {loading ? (
                      ""
                    ) : (
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
                    )}
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
            <Label
              label={`Custom ID untuk ${choosePart.map(
                (item) => item.res.name
              )}`}
            />
            <MainInput
              onChange={(e) => {
                setFormData({ ...formData, customId: e.target.value });
              }}
              placeholder="NIM/NIS/NIP/NIK"
            />
          </div>
        ) : (
          ""
        )}
      </MainModal>
      <div className="my-4 flex justify-end">
        {loading ? (
          <Skeleton className="w-48 h-10 rounded" count="1" />
        ) : (
          <MainButton
            onClick={() => {
              setShowModal(true);
            }}
            label="Tambah Pengurus"
          />
        )}
      </div>
      <div title="Table" className="my-4">
        {loading ? (
          <div className="flex justify-center">Loading...</div>
        ) : data.length > 0 ? (
          <TablePengurus clickCallback={clickCallback} data={data} />
        ) : (
          <div className="flex justify-center">Belum ada data</div>
        )}
      </div>
    </>
  );
};
export default Pengurus;
