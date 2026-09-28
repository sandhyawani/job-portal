import { setCompanies } from "@/redux/companySlice";
import { companyApi } from "@/api/companyApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await companyApi.getCompanies();

        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        console.error("Fetch companies error:", error);
        dispatch(setCompanies([])); 
      }
    };

    fetchCompanies();
  }, [dispatch]);
};

export default useGetAllCompanies;
