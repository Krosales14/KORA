namespace kora_identity_api.Services;

public interface ISmsSender
{
    Task SendAsync(string phoneE164, string message);
}

public sealed class ConsoleSmsSender : ISmsSender
{
    public Task SendAsync(string phoneE164, string message)
    {
        Console.WriteLine($"[SMS][DEV] To: {phoneE164} | {message}");
        return Task.CompletedTask;
    }
}