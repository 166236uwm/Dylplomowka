public interface ITransactionService
{
    Task<Transaction> CreateTransactionAsync(TransactionDto transactionDto);
    Task<Transaction> GetTransactionAsync(int id);
    Task<IEnumerable<Transaction>> GetAllTransactionsAsync();
}