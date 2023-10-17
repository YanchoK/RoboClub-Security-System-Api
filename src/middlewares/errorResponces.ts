import { Response } from 'express';


const errorResponces = {
    internalServerError: {
        message: "Internal server error",
    },
    memberNotFound: {
        message: "Member not found",
    },
    cardNotFound: {
        message: "Card not found",
    },
    invalidMemberData: {
        message: "Invalid Member data",
    },
    invalidCardData: {
        message: "Invalid card data",
    },
    createCardError: {
        message: "Error while creating a new card",
    },
    updateMemberError: {
        message: "Error while updating Member",
    },
    updateCardError: {
        message: "Error while updating card",
    },
    deleteMemberError: {
        message: "Error while deleting member",
    },
    fetchMembersError: {
        message: "Error while fetching members",
    },
    fetchMemberByIdError: {
        message: "Error while fetching member by ID",
    },
    memberAlreadyExists: {
        message: "Member with this email already exists"
    },
    cardAlreadyExists: {
        message: "Card with this value already exists"
    },
    updateEntryError: {
        message: "Error while updating entry",
    },
    entryNotFound: {
        message: "Entry not found",
    },
    invalidEntryData: {
        message: "Invalid entry data",
    },
}

export default errorResponces;