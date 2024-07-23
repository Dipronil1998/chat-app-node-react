import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";
import { useAuthContext } from "../../context/AuthContext";

const LogoutButton = () => {
	const { loading, logout } = useLogout();
	const {authUser} = useAuthContext();
	return (
		<div className='mt-auto flex items-center'>
			{!loading ? (
				<BiLogOut className='w-6 h-6 text-white cursor-pointer' onClick={logout} />
			) : (
				<span className='loading loading-spinner'></span>
			)}<p className="ml-2 text-white font-bold">{authUser?.response?.fullName}</p>
		</div>
	);
};
export default LogoutButton;
