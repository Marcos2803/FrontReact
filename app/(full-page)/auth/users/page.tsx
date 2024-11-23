'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import { AlunoService } from '@/demo/service/AlunoService';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Aluno = () => {
    let emptyAluno: Demo.Aluno = {
        id: '',
        name: '',
        image: '',
        description: '',
        category: '',
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };

    const [alunos, setAlunos] = useState(null);
    const [alunosDialog, setAlunosDialog] = useState(false);       /* cadastra produto*/
    const [deleteAlunoDialog, setDeleteAlunoDialog] = useState(false);
    const [deleteAlunosDialog, setDeleteAlunosDialog] = useState(false);
    const [aluno, setAluno] = useState<Demo.Aluno>(emptyAluno);
    const [selectedAlunos, setSelectedAlunos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
   

    /*busca lista de produtos no productservice*/
    useEffect(() => {
        AlunoService.getAlunos().then((data: any) => setAlunos(data as any));
    }, []);


   /* botao novo */
    const openNew = () => {
        setAluno(emptyAluno);
        setSubmitted(false);
        setAlunosDialog(true);
    };



    const hideDialog = () => {
        setSubmitted(false);
        setAlunosDialog(false);
    };

    
    
    /* botao  excluir*/
    const hideDeleteAlunoDialog = () => {
        setDeleteAlunosDialog(false);
    };

    const hideDeleteAlunosDialog = () => {
        setDeleteAlunosDialog(false);
    };



  /* Toast  criar e atualizar o produto */
    const saveAluno = () => {
        setSubmitted(true);

        if (aluno.name.trim()) {
            let _alunos = [...(alunos as any)];
            let _aluno = { ...aluno };
            if (aluno.id) {
                const index = findIndexById(aluno.id);

                _alunos[index] = _aluno;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Aluno atualizado com sucesso',
                    life: 3000
                });
            } else {
                _aluno.id = createId();
                _aluno.image = 'aluno-placeholder.svg';
                _alunos.push(_aluno);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Aluno cadastrado com sucesso',
                    life: 3000
                });
            }

            setAlunos(_alunos as any);
            setAlunosDialog(false);
            setAluno(emptyAluno);
        }
    };




     /* editar e excluir*/
    const editAluno = (product: Demo.Aluno) => {
        setAluno({ ...product });
        setAlunosDialog(true);
    };
    /* editar e excluir*/
    const confirmDeleteAluno = (product: Demo.Aluno) => {
        setAluno(product);
        setDeleteAlunoDialog(true);
    };



   /*exclui produto */
    const deleteAluno = () => {
        let _alunos = (alunos as any)?.filter((val: any) => val.id !== aluno.id);
        setAlunos(_alunos);
        setDeleteAlunoDialog(false);
        setAluno(emptyAluno);
        toast.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Aluno excluido com sucesso',
            life: 3000
        });
    };

    
 /* ta chamndo ele no Toast  criar e atualizar o produto */
    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (alunos as any)?.length; i++) {
            if ((alunos as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteAlunosDialog(true);
    };


    /*excluir lista */

    const deleteSelectedAlunos = () => {
        let _alunos = (alunos as any)?.filter((val: any) => !(selectedAlunos as any)?.includes(val));
        setAlunos(_alunos);
        setDeleteAlunosDialog(false);
        setSelectedAlunos(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Aluno excluido com sucesso',
            life: 3000
        });
    };



    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _aluno = { ...aluno };
        _aluno['category'] = e.value;
        setAluno(_aluno);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _aluno = { ...aluno };
        _aluno[`${name}`] = val;

        setAluno(_aluno);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _aluno = { ...aluno };
        _aluno[`${name}`] = val;

        setAluno(_aluno);
    };



    /* botao novo e excluir*/
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo Aluno" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedAlunos || !(selectedAlunos as any).length} />
                </div>
            </React.Fragment>
        );
    };


    /* exporta para excel*/

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                
                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };




    

    const codeBodyTemplate = (rowData: Demo.Aluno) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Aluno) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.Aluno) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };


    const categoryBodyTemplate = (rowData: Demo.Aluno) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData: Demo.Aluno) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readOnly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Aluno) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };


    /* editar e excluir*/

    const actionBodyTemplate = (rowData: Demo.Aluno) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editAluno(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteAluno(rowData)} />
            </>
        );
    };


    

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciar Alunos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Pesquisar..." />
            </span>
        </div>
    );




    /* botao de cadastra delete produto e lista */
    const alunoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveAluno} />
        </>
    );
    const deleteAlunoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAlunoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteAluno} />
        </>
    );
    const deleteAlunosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAlunosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedAlunos} />
        </>
    );



    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>




                    <DataTable
                        ref={dt}
                        value={alunos}
                        selection={selectedAlunos}
                        onSelectionChange={(e) => setSelectedAlunos(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} alunos"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum aluno encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Matricula" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Foto" body={imageBodyTemplate}></Column>
                  
                        <Column field="category" header="Categoria" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="rating" header="comentários" body={ratingBodyTemplate} sortable></Column>
                        <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>



                    
               
                    <Dialog visible={alunosDialog} style={{ width: '450px' }} header="Detalhes do produto" modal className="p-fluid" footer={alunoDialogFooter} onHide={hideDialog}>
                        {aluno.image && <img src={`/demo/images/product/${aluno.image}`} alt={aluno.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={aluno.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !aluno.name
                                })}
                            />

                            {submitted && !aluno.name && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={aluno.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !aluno.name
                                })}
                            />

                            {submitted && !aluno.name && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputTextarea id="description" value={aluno.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
            
                        <div className="field">
                            <label className="mb-3">Categoria</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={aluno.category === 'Accessories'} />
                                    <label htmlFor="category1">Accessorios</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={aluno.category === 'Clothing'} />
                                    <label htmlFor="category2">Roupas</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={aluno.category === 'Fitness'} />
                                    <label htmlFor="category4">Fitness</label>
                                </div>
                            </div>
                        </div>

                        
                    </Dialog>




                
                    <Dialog visible={deleteAlunoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteAlunoDialogFooter} onHide={hideDeleteAlunoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {aluno && (
                                <span>
                                    Tem certeza de que deseja excluir <b>{aluno.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>


                 
                    <Dialog visible={deleteAlunosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteAlunosDialogFooter} onHide={hideDeleteAlunosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {aluno && <span>Tem certeza de que deseja excluir os alunos selecionados?</span>}
                        </div>
                    </Dialog>


                    
                </div>
            </div>
        </div>
    );
};

export default Aluno;
