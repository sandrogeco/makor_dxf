using System.Net.Sockets;
using System.Threading;
using UAManagedCore;
using FTOptix.NetLogic;

public class publish : BaseNetLogic
{
    private TcpListener listener;
    private Thread listenerThread;

    public override void Start()
    {
        listener = new TcpListener(System.Net.IPAddress.Loopback, 8765);
        listener.Start();
        listenerThread = new Thread(ListenLoop) { IsBackground = true };
        listenerThread.Start();
    }

    public override void Stop()
    {
        listener?.Stop();
    }

    private void ListenLoop()
    {
        while (true)
        {
            try
            {
                var client = listener.AcceptTcpClient();
                var stream = client.GetStream();

                object raw = Project.Current
                    .GetVariable("Model/NomeCartella/NomeVariabile").Value;
                float[,] punti = raw as float[,];

                var sb = new System.Text.StringBuilder();
                sb.Append("{\"points\":[");
                int n = punti != null ? punti.GetLength(0) : 0;
                for (int i = 0; i < n; i++)
                {
                    if (i > 0) sb.Append(',');
                    sb.Append('[');
                    sb.Append(punti[i, 0].ToString(System.Globalization.CultureInfo.InvariantCulture));
                    sb.Append(',');
                    sb.Append(punti[i, 1].ToString(System.Globalization.CultureInfo.InvariantCulture));
                    sb.Append(']');
                }
                sb.Append("]}");

                var body = System.Text.Encoding.UTF8.GetBytes(sb.ToString());
                var header = System.Text.Encoding.UTF8.GetBytes(
                    $"HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: {body.Length}\r\n\r\n");
                stream.Write(header, 0, header.Length);
                stream.Write(body, 0, body.Length);
                client.Close();
            }
            catch { }
        }
    }
}
