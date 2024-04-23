import express, { Request, Response } from 'express';
import { RolesController } from '../controller/RolesController';

const jsonParser = express.json();
let rolesRouter = express.Router();

rolesRouter.route('/create-role')
    .post(jsonParser, async (req: Request, res: Response) => {
        try {
            const { name } = req.body;
            if (name) {
                const controller: RolesController = new RolesController();
                const response: any = await controller.createRole(name);
                return res.status(200).send(response);
            } else {
                return res.status(400).send({
                    message: '[Error Role Data Missing] Role cannot be created',
                });
            }
        } catch (error) {
            console.error('[RolesRouter]: Error creating role:', error);
            return res.status(500).send({
                message: 'Internal server error',
            });
        }
    });

export default rolesRouter;
