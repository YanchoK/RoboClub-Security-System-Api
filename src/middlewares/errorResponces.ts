import { Response } from 'express';


const errorResponces = {
    internalServerError: {
        message: "Internal server error",
    },
    memberNotFound: {
        message: "Member not found",
    },
    ticketNotFound: {
        message: "Ticket not found",
    },
    invalidMemberData: {
        message: "Invalid Member data",
    },
    invalidTicketData: {
        message: "Invalid ticket data",
    },
    createTicketError: {
        message: "Error while creating a new ticket",
    },
    updateMemberError: {
        message: "Error while updating Member",
    },
    updateTicketError: {
        message: "Error while updating ticket",
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
    }
}

export default errorResponces;