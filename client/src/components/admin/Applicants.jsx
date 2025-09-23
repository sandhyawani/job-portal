import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    // get job id from url
    const params = useParams();
    // for dispatching redux actions
    const dispatch = useDispatch();
    // get applicants data from redux
    const {applicants} = useSelector(store => store.application);

    // run only on first render
    useEffect(() => {
        // function to fetch applicants from api
        const fetchAllApplicants = async () => {
            try {
                // call api with job id, also send cookies
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                // save applicants data into redux
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);

    return (
        <div>
            {/* navbar on top */}
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                {/* show count of applicants */}
                <h1 className='font-bold text-xl my-5'>Applicants {applicants?.applications?.length}</h1>
                {/* table of applicants */}
                <ApplicantsTable />
            </div>
        </div>
    )
}

export default Applicants
