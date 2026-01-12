import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { SupplierController } from './supplier.controller'; // Importação do novo controller
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();
const productController = new InventoryController();
const supplierController = new SupplierController();

router.use(authMiddleware);

// === PRODUTOS/CATEGORIAS === //
router.get('/products', productController.listProducts);
router.post('/products', roleMiddleware(['ADMIN', 'MANAGER']), productController.createProduct);
router.put('/products/:id', roleMiddleware(['ADMIN', 'MANAGER']), productController.updateProduct);
router.delete('/products/:id', roleMiddleware(['ADMIN', 'MANAGER']), productController.deleteProduct);

// === FORNECEDORES (MARCAS) === //
router.get('/suppliers', supplierController.listSuppliers);
router.post('/suppliers', roleMiddleware(['ADMIN', 'MANAGER']), supplierController.createSupplier);
router.put('/suppliers/:id', roleMiddleware(['ADMIN', 'MANAGER']), supplierController.updateSupplier);
router.delete('/suppliers/:id', roleMiddleware(['ADMIN', 'MANAGER']), supplierController.deleteSupplier);

export default router;