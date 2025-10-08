from pydantic import BaseModel,Field,ConfigDict
from typing import Optional

class File(BaseModel):
    path: str= Field(description="The path to the file to be created or modifeid ")
    purpose: str= Field(description="The purpose of the file to be created or modified, e.g 'main application logic','data processing module',etc. ")

class Plan(BaseModel):
    name: str =Field(description="The name of app to be built")
    description: str = Field(description="A oneline description of app to be built,e.g. 'A web application for managing person ")
    techstack : str =Field(description="The techstack of app to be used for the app ,e.g . 'python','javascript','react','flask', etc")
    features : list[str] =Field(description="A list of  features of app should have ,e.g . 'user authentication','data visualization '")
    files : list[File] = Field(description= "A list of files to be created , each with 'path' and 'purpose' ")

class ImplementationTask(BaseModel):
    filepath: str= Field(description="The path to the file to be created or modifeid ")
    task_description:str= Field(description="A detailed descripton of the task to be performed on  files according to the user")

class TaskPlan(BaseModel):
    implementation_steps: list[ImplementationTask]= Field(description="A list of steps to be taken into consideration for the task ")
    model_config = ConfigDict(extra="allow")

class CoderState(BaseModel):
    task_plan: TaskPlan= Field(description="The task plan for execution ")
    current_step_idx: int= Field(0,description="The index of the current step in the implementation steps")
    current_file_content : Optional[str]= Field(None,description="The content of the current file")