public interface ITransactionService
{
    Task<Transaction> CreateTransactionAsync(TransactionDto transactionDto);
    Task<TransactionDto> GetTransactionAsync(int id);
    Task<IEnumerable<TransactionSummaryDto>> GetAllTransactionsAsync();
}