namespace QuitQ.Api.DTOs
{
    public class SellerSalesReportDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalUnitsSold { get; set; }
        public int TotalOrdersProcessed { get; set; }
        public List<ProductSalesItemDto> ProductSales { get; set; } = new List<ProductSalesItemDto>();
        public List<OrderReportRowDto> RecentSalesList { get; set; } = new List<OrderReportRowDto>();
    }

    public class ProductSalesItemDto
    {
        public int ProductId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public int UnitsSold { get; set; }
        public decimal Revenue { get; set; }
        public int RemainingStock { get; set; }
    }

    public class OrderReportRowDto
    {
        public string OrderNumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class AdminSystemReportDto
    {
        public int TotalUsers { get; set; }
        public int TotalSellers { get; set; }
        public int TotalProducts { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalPlatformRevenue { get; set; }
        public List<PlatformTransactionRowDto> TransactionsList { get; set; } = new List<PlatformTransactionRowDto>();
    }

    public class PlatformTransactionRowDto
    {
        public string OrderNumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public string CustomerEmail { get; set; } = string.Empty;
        public string SellerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string OrderStatus { get; set; } = string.Empty;
    }
}
