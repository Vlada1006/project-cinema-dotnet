﻿using Cinema_project_dotnet.BusinessLogic.DTOs;
using Cinema_project_dotnet.BusinessLogic.Interfaces;
using Cinema_project_dotnet.BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cinema_project_dotnet.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrasactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TrasactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult> PayBooking(decimal amount)
        {
            var transaction = await _transactionService.PayBooking(amount);
            return Ok(new { message = "Payment was successful.", data = transaction });
        }
    }
}
