import MainBox from "../MainBox";
import RoundedButton from "../../../../RoundedButton";
import ErrorLabel from "../../../../ErrorLabel";
import Skeleton from "../../../../Skeleton";
import { useEffect, useState } from "react";
import MainModal from "../../../../modals/MainModal";
import MainInput from "../../../../MainInput";
import Label from "../../../../Label";
import SelectInput from "../../../../SelectInput";
import Banks from "../../../../../banks.json";
import apiClient from "../../../../services/apiClient";
import Swal from "sweetalert2";

const Rekening = () => {
  const [isLoading, setLoading] = useState(true);
  const [isLoadingModal, setLoadingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bankData, setbankData] = useState([]);
  const [formData, setformData] = useState({
    id: "",
    name: "",
    isNameError: false,
    nameErrorLabel: "",
    account: "",
    isAccountError: false,
    accountErrorLabel: "",
    bank: "",
    bankName: "",
    isBankError: false,
    bankErrorLabel: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      await apiClient
        .get("/api/v1/organization/bank")
        .then((response) => {
          if (response.status === 200) {
            setbankData(response.data.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          // console.log(error);
          setLoading(false);
        });
    };
    setLoading(true);
    fetchData();
  }, [setbankData]);

  const handleSwal = (data, status) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: status ? status : "success",
      title: data,
    });
  };

  const reFetchData = async () => {
    setLoading(true);
    await apiClient
      .get("/api/v1/organization/bank")
      .then((response) => {
        if (response.status === 200) {
          setbankData(response.data.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);
      });

  };

  const showEditBank = async (id) => {
    setLoadingModal(true);
    setShowEditModal(true);
    await apiClient
      .get("/api/v1/organization/bank/" + id)
      .then((response) => {
        if (response.status === 200) {
          setformData({
            id: response.data.data.id,
            name: response.data.data.holder_name,
            account: response.data.data.account_no,
            bank: response.data.data.bank_code,
          });
          setLoadingModal(false);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const handleCheck = () => {
    if (
      formData.account &&
      formData.name &&
      formData.bank &&
      formData.bankName
    ) {
      return true;
    } else if (!formData.name) {
      setformData({
        ...formData,
        isNameError: true,
        nameErrorLabel: "Astaga nama aja lupa donggg",
      });
    } else if (!formData.account) {
      setformData({
        ...formData,
        isAccountError: true,
        accountErrorLabel: "Ya masa No. Rekeningnya dilupain sih",
      });
    } else if (!formData.bank) {
      setformData({
        ...formData,
        isBankError: true,
        bankErrorLabel: "Gimana sih bestie, isi dong nama banknya juga",
      });
    }
    return false;
  };

  const handleEdit = async () => {
    const check = handleCheck();
    if (check) {
      await apiClient
        .put("/api/v1/organization/bank/" + formData.id, {
          holder_name: formData.name,
          channel: formData.bankName,
          account_no: formData.account,
          bank_code: formData.bank,
        })
        .then((response) => {
          handleSwal(response.data.message);
          reFetchData();
          closeModal();
        })
        .catch((error) => {
          //
        });
    }
  };

  const handleAdd = async () => {
    const check = handleCheck();
    if (check) {
      await apiClient
        .post("api/v1/organization/bank", {
          holder_name: formData.name,
          channel: formData.bankName,
          account_no: formData.account,
          bank_code: formData.bank,
        })
        .then((response) => {
          if (response.status === 200) {
            handleSwal(response.data.message);
            closeModal();
            reFetchData();
          }
        })
        .catch((error) => {
          //
        });
    }
  };

  const handleDelete = async (id) => {
    await apiClient
      .delete("api/v1/organization/bank/" + id)
      .then((response) => {
        handleSwal(response.data.message);
        reFetchData();
      })
      .catch((error) => {
        //
      });
  };

  const closeModal = () => {
    setformData({
      id: "",
      name: "",
      isNameError: false,
      nameErrorLabel: "",
      account: "",
      isAccountError: false,
      accountErrorLabel: "",
      bank: "",
      bankName: "",
      isBankError: false,
      bankErrorLabel: "",
    });
    showAddModal ? setShowAddModal(false) : setShowEditModal(false);
  };

  return (
    <>
      <MainModal
        showModal={showAddModal || showEditModal}
        handleClose={() => {
          closeModal();
        }}
        onClick={() => {
          showAddModal ? handleAdd() : handleEdit();
        }}
        buttonLabel={"Simpan"}
        title={showAddModal ? "Tambah Rekening" : "Edit Rekening"}
      >
        <div>
          <div className="mt-4">
            {isLoadingModal ? (
              <Skeleton className="w-28 h-2 rounded" count={1} />
            ) : (
              <Label label="Nama Pemilik" />
            )}
            {isLoadingModal ? (
              <Skeleton className="w-full h-10 rounded" count={1} />
            ) : (
              <MainInput
                value={formData.name}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    name: e.target.value,
                    isNameError: false,
                  })
                }
                name="name"
                type="text"
              />
            )}
            {formData.isNameError ? (
              <ErrorLabel label={formData.nameErrorLabel} />
            ) : (
              ""
            )}
          </div>
          <div className="mt-4">
            {isLoadingModal ? (
              <Skeleton className="w-14 h-2 rounded" count={1} />
            ) : (
              <Label label="No. Rekening" />
            )}
            {isLoadingModal ? (
              <Skeleton className="w-full h-10 rounded" count={1} />
            ) : (
              <MainInput
                value={formData.account}
                onChange={(e) => {
                  setformData({
                    ...formData,
                    account: e.target.value,
                    isAccountError: false,
                  });
                }}
                name="account"
                type="text"
              />
            )}
            {formData.isAccountError ? (
              <ErrorLabel label={formData.accountErrorLabel} />
            ) : (
              ""
            )}
          </div>
          <div className="mt-4">
            {isLoadingModal ? (
              <Skeleton className="w-14 h-2 rounded" count={1} />
            ) : (
              <Label label="Nama Bank" />
            )}
            {isLoading ? (
              <Skeleton className="w-full h-10 rounded" count={1} />
            ) : (
              <SelectInput
                value={formData.bank}
                onChange={(e) => {
                  setformData({
                    ...formData,
                    bank: e.target.value,
                    bankName: Banks.filter(
                      (item, i) => item.code === e.target.value
                    )[0].name,
                    isBankError: false,
                  });
                }}
                name="bank"
              >
                <option selected hidden>
                  Pilih bank
                </option>
                {Banks.map((item, i) => (
                  <option key={i} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </SelectInput>
            )}
            {formData.isBankError ? (
              <ErrorLabel label={formData.bankErrorLabel} />
            ) : (
              ""
            )}
          </div>
        </div>
      </MainModal>
      <div className="m-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <Skeleton className="w-full h-40 rounded" count="1" />
          ) : (
            bankData.map((item, i) => (
              <MainBox key={i} loading={isLoading} className="pt-4">
                <div className="flex justify-between">
                  <div className="font-semibold text-4xl pb-4">
                    {item.channel}
                  </div>
                  <div className="font-semibold text-4xl pb-4">
                    <RoundedButton
                      type="button"
                      onClick={(e) => {
                        showEditBank(item.id);
                      }}
                      className="w-10 h-10 mx-1"
                      disabled={false}
                    >
                      <img
                        className="w-6 h-6 p-1"
                        src={process.env.PUBLIC_URL + "/edit.svg"}
                        alt="Icon"
                      />
                    </RoundedButton>
                    <RoundedButton
                      type="button"
                      onClick={(e) => {
                        handleDelete(item.id);
                      }}
                      className="w-10 h-10 mx-1"
                      disabled={false}
                    >
                      <img
                        className="w-6 h-6 p-1"
                        src={process.env.PUBLIC_URL + "/trash.svg"}
                        alt="Icon"
                      />
                    </RoundedButton>
                  </div>
                </div>
                <div className="font-light text-2xl pt-4 whitespace-normal">
                  {item.holder_name}
                </div>
                <div className="font-light text-right text-2xl pt-4 whitespace-normal">
                  {item.account_no}
                </div>
              </MainBox>
            ))
          )}
          {bankData.length < 3 ? (
            <MainBox
              loading={isLoading}
              className="pt-4 cursor-pointer"
              onClick={() => {
                setShowAddModal(true);
              }}
            >
              <div className="font-semibold text-center text-5xl">
                <img
                  className="w-24 h-24 mx-auto"
                  src={process.env.PUBLIC_URL + "/plus.svg"}
                  alt="Icon"
                />
                <span className="text-2xl">Tambah Rekening Baru</span>
              </div>
            </MainBox>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
export default Rekening;
