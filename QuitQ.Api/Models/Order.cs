using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuitQ.Api.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(40)]
        public string OrderNumber { get; set; } = string.Empty;

        [Required]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        [MaxLength(300)]
        public string ShippingAddress { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = "Credit Card"; // UPI, Net Banking, Card, COD

        [Required]
        [MaxLength(30)]
        public string PaymentStatus { get; set; } = "Completed"; // Pending, Completed, Failed

        [Required]
        [MaxLength(30)]
        public string OrderStatus { get; set; } = "Placed"; // Placed, Processing, Shipped, Delivered, Cancelled

        [MaxLength(60)]
        public string TrackingNumber { get; set; } = string.Empty;

        public DateTime? EstimatedDeliveryDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
