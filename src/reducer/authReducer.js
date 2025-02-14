const authReducer = (state, action) => {
  switch (action.type) {
    case "USER_REGISTER_REQUEST":
    case "USER_LOGIN_REQUEST":
    case "CREATE_VENDOR_REQUEST":
    case "GET_ALL_VENDOR_REQUEST":
    case "GET_SINGLE_VENDOR_REQUEST":
    case "DELETE_VENDOR_REQUEST":
    case "UPDATE_VENDOR_REQUEST":
    case "GET_ALL_ADMIN_VENDORS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "USER_REGISTER_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload,
      };

    case "USER_LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };

    case "USER_LOGOUT_SUCCESS":
      return {
        ...state,
        loading: false,
        user: null,
        error: null,
        isAuthenticated: false,
      };

    case "CREATE_VENDOR_SUCCESS":
      return {
        ...state,
        loading: false,
        newVendor: action.payload,
      };

    case "GET_ALL_ADMIN_VENDORS_SUCCESS":
      return {
        ...state,
        loading: false,
        vendors: action.payload,
      };

    case "GET_ALL_VENDOR_SUCCESS":
      return {
        ...state,
        loading: false,
        vendors: action.payload.vendors,
        vendorCounts: action.payload.vendorCounts,
        resultPerPage: action.payload.resultPerPage,
        currentPage: action.payload.currentPage || 1,
      };

    case "GET_SINGLE_VENDOR_SUCCESS":
      return {
        ...state,
        loading: false,
        vendor: action.payload.vendor,
      };

    case "DELETE_VENDOR_SUCCESS":
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case "UPDATE_VENDOR_SUCCESS":
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case "USER_REGISTER_FAIL":
    case "USER_LOGIN_FAIL":
    case "CREATE_VENDOR_FAIL":
    case "GET_ALL_VENDOR_FAIL":
    case "GET_SINGLE_VENDOR_FAIL":
    case "DELETE_VENDOR_FAIL":
    case "GET_ALL_ADMIN_VENDORS_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "DELETE_VENDOR_RESET":
      return {
        ...state,
        isDeleted: false,
      };

    case "UPDATE_VENDOR_RESET":
      return {
        ...state,
        isUpdated: false,
      };

    default:
      return state;
  }
};

export default authReducer;
