const paymentReducer = (state, action) => {
  switch (action.type) {
    case "MAKE_PAYMENT_REQUEST":
      case "GET_VENDOR_BILL_PAYMENTS_REQUEST":
        case "GET_VENDORS_BILL_PAYMENTS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "MAKE_PAYMENT_SUCCESS":
      return {
        ...state,
        loading: false,
        payment: action.payload,
      };

      case "GET_VENDOR_BILL_PAYMENTS_SUCCESS":
        return{
          ...state,
          loading:false,
          payments:action.payload.bills
        }

        case "GET_VENDORS_BILL_PAYMENTS_SUCCESS":
          return{
            ...state,
            loading:false,
            vendors:action.payload.vendors
          }
    case "MAKE_PAYMENT_FAIL":
      case "GET_VENDOR_BILL_PAYMENTS_FAIL":
        case "GET_VENDORS_BILL_PAYMENTS_FAIL":
       
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default paymentReducer;
