import { Outlet} from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Header from './components/Header'
import { fetchuserDetails } from './Utils/fetchuserdetails'
import { getuserinfo } from './store/userdetailsSlice'
import { Toaster } from 'react-hot-toast'
import { setAllcategories } from './store/productSlice';
import { setAllsubcategories } from './store/productSlice';
import { Axios } from './Utils/Axios';
import { SummaryApi } from './common/SummaryApi';
import { fetchCartItem } from './store/cartSlice'
import ScrollToTop from './components/ScrolTop'
import { setAllAddresses } from './store/addressSlice';
import Footer from './components/Footer'



function App() {
    const dispatch = useDispatch()
    const fetchCategories = async () => {
        try {
            const response = await Axios({
                url: SummaryApi.getallcategory.url,
                method: SummaryApi.getallcategory.method,
            })
            dispatch(setAllcategories(response.data.data))
        } catch (error) {
            console.log(error)
        }
    }

    const fetchsubCategories = async () => {
        try {
            const response = await Axios({
                url: SummaryApi.Getsubcategories.url,
                method: SummaryApi.Getsubcategories.method,
            })

            dispatch(setAllsubcategories(response.data.data))
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUser = async () => {
        try {
            const userData = await fetchuserDetails()
            if (userData?.data?.user) {
                dispatch(getuserinfo(userData.data.user));
            }
            console.log(" userData from API:", userData);
        } catch (err) {
            console.log(err)
        }
    }
    const fetchAddress = async () => {
        try {
            const response = await Axios({
                url: SummaryApi.GetAddress.url,
                method: SummaryApi.GetAddress.method,
            });

            if (response?.data?.data) {
                dispatch(setAllAddresses(response.data.data));
            }
        } catch (error) {
            console.log("Error fetching address", error);
        }
    };
    useEffect(() => {
        fetchUser()
        fetchCategories()
        fetchsubCategories()
        dispatch(fetchCartItem())
        fetchAddress();
    },[])

    return (
        <>
        <ScrollToTop/>
            <Header />
            <main className='min-h-[78vh] flex-1'>
                <Outlet />
            </main>
            <Footer/>

            <Toaster />
        </>

    )
}

export default App

