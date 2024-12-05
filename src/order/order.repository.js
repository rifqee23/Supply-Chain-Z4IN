const prisma = require('../db');

class OrderRepository {

    async create(orderData) {
        const { userID, productID, quantity } = orderData;
        return await prisma.Orders.create({
            data: {
                userID,
                productID,
                quantity,
                status: 'PENDING'
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                product: {
                    include: {
                        supplier: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }

    // Get all orders for a supplier's products
    async findSupplierOrders(userID) {
        return await prisma.Orders.findMany({
            where: {
                product: {
                    userID: userID 
                }
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                product: true
            },
            orderBy: [
                {
                    status: 'asc' 
                },
                {
                    created_at: 'desc' 
                }
            ]
        });
    }

    // Get all orders for a user
    async findUserOrders(userID) {
        return await prisma.Orders.findMany({
          where: {
            userID: userID
          },
          include: {
            product: {
              include: {
                supplier: {
                  select: {
                    username: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: {
            created_at: 'desc'
          }
        });
      }

      async findSupplierOrderHistory(supplierUserID) {
        return await prisma.Orders.findMany({
            where: {
                product: {
                    userID: supplierUserID
                }
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                product: {
                    include: {
                        supplier: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    }
    
    // Find order by ID
    async findById(orderID) {
        return await prisma.Orders.findUnique({
            where: { 
                orderID: parseInt(orderID) 
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                product: {
                    include: {
                        supplier: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }
    // Update order status
    async updateStatus(orderID, status) {
        return await prisma.Orders.update({
            where: { 
                orderID: orderID 
            },
            data: { 
                status: status,
                updated_at: new Date()
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                product: {
                    include: {
                        supplier: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }

    // Delete order
    async delete(orderID) {
        return await prisma.Orders.delete({
            where: { 
                orderID: orderID 
            }
        });
    }
    async checkSupplierProduct(orderID, userID) {
        const order = await prisma.Orders.findFirst({
            where: {
                orderID: orderID,
                product: {
                    userID: userID 
                }
            }
        });
        return order !== null;
    }

    async checkSupplierProduct(orderID, userID) {
        const order = await prisma.Orders.findFirst({
            where: {
                orderID: orderID,
                product: {
                    userID: userID
                }
            }
        });
        return order !== null;
    }

    async findOrderHistory(userID, role) {
        const query = role === 'SUPPLIER' 
            ? {
                product: {
                    userID: userID
                }
            }
            : { userID: userID };

        return await prisma.Orders.findMany({
            where: query,
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                product: {
                    include: {
                        supplier: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    }

    async updateHistoryEntry(historyID, updateData) {
        return await prisma.Orders.update({
            where: { 
                orderID: historyID 
            },
            data: {
                ...updateData,
                updated_at: new Date()
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                product: {
                    include: {
                        supplier: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }

    async deleteHistoryEntry(historyID) {
        return await prisma.Orders.delete({
            where: { 
                orderID: historyID 
            }
        });
    }

    async updateStatusWithQRCode(orderID, status, qrCodePath) {
        return await prisma.Orders.update({
            where: { 
                orderID: orderID 
            },
            data: { 
                status: status,
                qr_code: qrCodePath, 
                updated_at: new Date()
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                product: {
                    include: {
                        supplier: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }

    async getOrderById(orderID, supplierUserID) {
        const order = await prisma.Orders.findFirst({
            where: {
                orderID: parseInt(orderID),
                product: {
                    userID: supplierUserID
                }
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                product: {
                    include: {
                        supplier: {
                            select: {
                                username: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    
        if (!order) {
            throw new Error("Order not found or Unauthorized access");
        }
    
        return order;
    }
}

module.exports = OrderRepository;