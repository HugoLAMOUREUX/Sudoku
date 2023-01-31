package game.controllers;

import game.services.GridService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class GridControllerTest {

    @Autowired
    private MockMvc mvc;

    int[] gridValues1;
    int[] gridValues2;

    @BeforeEach
    void setUp() {
    }

    @Test
    void getAllGrids() throws Exception {
        mvc.perform(get("/game/grids/allGrids"))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void getGridHighScores() throws Exception {
        mvc.perform(get("/game/grids/1/gridHighScore"))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void getGridHighScoresException() throws Exception {
        mvc.perform(get("/game/grids/0/gridHighScore"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getGridData() throws Exception {
        mvc.perform(get("/game/grids/1/gridData"))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void getGridDataException() throws Exception {
        mvc.perform(get("/game/grids/0/gridData"))
                .andExpect(status().isNotFound());
    }

    @Test
    void setScore() throws Exception {
        mvc.perform(post("/game/grids/score").contentType(MediaType.APPLICATION_JSON).content(
                """
                        {"values": [1,9,0,0,6,4,5,2,3,0,0,2,5,8,9,0,4,7,0,0,5,2,3,0,6,8,9,0,0,6,0,0,8,2,0,5,0,5,9,0,4,2,0,1,8,2,8,1,3,7,5,9,6,4,8,2,4,9,5,6,0,0,1,5,0,0,8,2,7,4,9,6,9,6,7,4,1,3,8,5,2],"player": "test","score":19}"""))
                .andExpect(status().isOk());
    }

    @Test
    void setScoreNotCorrect80entries() throws Exception {
        mvc.perform(post("/game/grids/score").contentType(MediaType.APPLICATION_JSON).content(
                """
                        {"values": [9,0,0,6,4,5,2,3,0,0,2,5,8,9,0,4,7,0,0,5,2,3,0,6,8,9,0,0,6,0,0,8,2,0,5,0,5,9,0,4,2,0,1,8,2,8,1,3,7,5,9,6,4,8,2,4,9,5,6,0,0,1,5,0,0,8,2,7,4,9,6,9,6,7,4,1,3,8,5,2],"player": "test","score":19}
                        	"""))
                .andExpect(status().isNotAcceptable());
    }

    @Test
    void setScoreNotCorrectNoPlayer() throws Exception {
        mvc.perform(post("/game/grids/score").contentType(MediaType.APPLICATION_JSON).content(
                """
                        {"values": [1,9,0,0,6,4,5,2,3,0,0,2,5,8,9,0,4,7,0,0,5,2,3,0,6,8,9,0,0,6,0,0,8,2,0,5,0,5,9,0,4,2,0,1,8,2,8,1,3,7,5,9,6,4,8,2,4,9,5,6,0,0,1,5,0,0,8,2,7,4,9,6,9,6,7,4,1,3,8,5,2],"score":19}
                        	"""))
                .andExpect(status().isNotAcceptable());
    }
}