const billReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_NEW_BILL_REQUEST":
    case "GET_SINGLE_PERSON_ALL_BILL_REQUEST":
      case "GET_SINGLE_BILL_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "CREATE_NEW_BILL_SUCCESS":
      return {
        ...state,
        loading: false,
        savedbill: action.payload,
      };
      case "GET_SINGLE_PERSON_ALL_BILL_SUCCESS":
        return {
          ...state,
          loading: false,
          vendorBills: action.payload.vendorBills, // Ensure this payload is an array
        };
        case "GET_SINGLE_BILL_SUCCESS":
          return{
            ...state,
            loading: false,
            bill: action.payload.bill
          }

    case "CREATE_NEW_BILL_FAIL":
    case "GET_SINGLE_PERSON_ALL_BILL_FAIL":
      case "GET_SINGLE_BILL_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

      default:
        return state;
  }
};

export default billReducer;
