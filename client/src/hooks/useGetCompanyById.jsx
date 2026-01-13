import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSingleCompany } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  // Local loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;

    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch company details by ID
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/${companyId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        } else {
          setError("Company not found");
        }
      } catch (err) {
        console.error("Fetch Company Error:", err);
        setError("Failed to load company");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId, dispatch]);

  return { loading, error };
};

export default useGetCompanyById;
